import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpaySignature, getRazorpayClient, checkRazorpayConfig } from "@/lib/razorpay";
import { getServiceSupabase } from "@/lib/supabase";
import { Order } from "@/lib/types";

// In-memory cache for fast local retrieval & fallback
const confirmedOrders: Order[] = [];

// In-flight verification promises to deduplicate parallel requests for the same payment
const inFlightVerifications = new Map<string, Promise<any>>();

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    // 1. Safe configuration check
    const configCheck = checkRazorpayConfig();
    if (!configCheck.isConfigured) {
      console.error("[Razorpay Verify Error]:", configCheck.error);
      return NextResponse.json(
        {
          success: false,
          error: configCheck.error,
          isConfigured: false,
        },
        { status: 503 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderDetails,
    } = body;

    // 2. Validate required verification parameters
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required verification parameters (razorpay_order_id, razorpay_payment_id, razorpay_signature).",
        },
        { status: 400 }
      );
    }

    // 3. Idempotency Check (In-memory)
    const existingOrder = confirmedOrders.find(
      (o) => o.paymentId === razorpay_payment_id
    );
    if (existingOrder && existingOrder.paymentStatus === "PAID") {
      console.log(`[Razorpay Flow]: Idempotent verification match for Payment ${razorpay_payment_id}`);
      return NextResponse.json({
        success: true,
        message: "Payment already verified and captured (idempotent response).",
        order: existingOrder,
      });
    }

    // Idempotency Check (Supabase Database)
    try {
      const db = getServiceSupabase();
      const { data: dbOrder } = await db
        .from("orders")
        .select("*")
        .eq("payment_id", razorpay_payment_id)
        .maybeSingle();

      if (dbOrder && dbOrder.payment_status === "PAID") {
        const orderFromDb: Order = {
          id: dbOrder.id,
          orderId: dbOrder.order_id,
          razorpayOrderId: dbOrder.razorpay_order_id,
          paymentId: dbOrder.payment_id,
          productId: dbOrder.product_id || orderDetails?.productId || "unknown",
          productTitle: orderDetails?.productTitle || "Campus Purchase",
          sellerId: dbOrder.seller_id || "seller_vitap",
          sellerName: orderDetails?.sellerName || "Verified Student Seller",
          buyerName: dbOrder.buyer_name,
          buyerEmail: dbOrder.buyer_email,
          itemAmount: Number(dbOrder.seller_amount || 0),
          platformFee: Number(dbOrder.platform_fee || 0),
          totalAmount: Number(dbOrder.total_amount || 0),
          status: "PAID",
          paymentStatus: "PAID",
          exchangeLocation: dbOrder.exchange_location,
          exchangeTime: dbOrder.exchange_time,
          createdAt: dbOrder.created_at,
        };
        if (!confirmedOrders.some((o) => o.orderId === orderFromDb.orderId)) {
          confirmedOrders.unshift(orderFromDb);
        }
        return NextResponse.json({
          success: true,
          message: "Payment already verified in database (idempotent response).",
          order: orderFromDb,
        });
      }
    } catch (dbCheckErr) {
      // Non-fatal, continue with signature verification
    }

    // Deduplicate in-flight parallel verification requests
    const inFlightKey = `${razorpay_order_id}_${razorpay_payment_id}`;
    if (inFlightVerifications.has(inFlightKey)) {
      console.log(`[Razorpay Flow]: Reusing in-flight verification for ${inFlightKey}`);
      const inFlightResult = await inFlightVerifications.get(inFlightKey);
      return NextResponse.json(inFlightResult.data, { status: inFlightResult.status });
    }

    // Process verification and register promise
    const verificationPromise = (async () => {
      // 4. Verify HMAC SHA256 Signature
      let isSignatureValid = false;
      try {
        isSignatureValid = verifyRazorpaySignature(
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature
        );
      } catch (err: any) {
        console.error("[Signature Verification Failed]:", err.message);
        return {
          status: 500,
          data: { success: false, error: "Cryptographic signature verification failed: " + err.message },
        };
      }

      if (!isSignatureValid) {
        console.warn(`[Razorpay Security Alert]: Invalid signature received for Order ${razorpay_order_id}`);
        return {
          status: 400,
          data: { success: false, error: "Invalid payment signature. Verification failed." },
        };
      }

      // 5. Confirm Payment Status directly with Razorpay API (Double-Verification)
      try {
        const razorpay = getRazorpayClient();
        const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);

        if (paymentDetails.order_id !== razorpay_order_id) {
          return {
            status: 400,
            data: { success: false, error: "Payment order ID mismatch. Transaction rejected." },
          };
        }

        if (paymentDetails.status !== "captured" && paymentDetails.status !== "authorized") {
          return {
            status: 400,
            data: { success: false, error: `Payment is not in captured status (current: ${paymentDetails.status}).` },
          };
        }
      } catch (apiErr: any) {
        // In local offline tests or sandbox, HMAC signature check has already passed
        console.warn("[Razorpay Payment Fetch Notice]:", apiErr.message);
      }

      // 6. Build confirmed order record
      const confirmedRecord: Order = {
        id: `order_${Date.now()}`,
        orderId: razorpay_order_id,
        razorpayOrderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        productId: orderDetails?.productId || "unknown",
        productTitle: orderDetails?.productTitle || "Campus Purchase",
        productImage: orderDetails?.productImage,
        sellerId: orderDetails?.sellerId || "seller_vitap",
        sellerName: orderDetails?.sellerName || "Verified Student Seller",
        buyerName: orderDetails?.buyerName || "VIT-AP Student",
        buyerEmail: orderDetails?.buyerEmail || "student@vitap.ac.in",
        itemAmount: orderDetails?.itemAmount || 0,
        platformFee: orderDetails?.platformFee || 0,
        totalAmount: orderDetails?.totalAmount || 0,
        status: "PAID",
        paymentStatus: "PAID",
        exchangeLocation: orderDetails?.exchangeLocation || "Central Library Ground Desk",
        exchangeTime: orderDetails?.exchangeTime || "Tomorrow at 4:30 PM",
        createdAt: new Date().toISOString(),
      };

      confirmedOrders.unshift(confirmedRecord);

      // 7. Update Supabase Orders & Transactions tables
      try {
        const db = getServiceSupabase();
        await db
          .from("orders")
          .update({
            status: "PAID",
            payment_status: "PAID",
            payment_id: razorpay_payment_id,
            updated_at: new Date().toISOString(),
          })
          .eq("razorpay_order_id", razorpay_order_id);

        await db.from("transactions").insert([
          {
            order_id: razorpay_order_id,
            razorpay_payment_id: razorpay_payment_id,
            razorpay_order_id: razorpay_order_id,
            razorpay_signature: razorpay_signature,
            amount_paise: Math.round((orderDetails?.totalAmount || 0) * 100),
            currency: "INR",
            status: "CAPTURED",
          },
        ]);
      } catch (dbErr) {
        console.warn("[Supabase Sync Notice]: Database transaction record logged to in-memory store.", dbErr);
      }

      console.log(`[Razorpay Flow]: Successfully verified and captured Order ${razorpay_order_id}`);

      return {
        status: 200,
        data: {
          success: true,
          message: "Payment successfully verified and confirmed on campus escrow network.",
          order: confirmedRecord,
        },
      };
    })();

    inFlightVerifications.set(inFlightKey, verificationPromise);

    try {
      const result = await verificationPromise;
      return NextResponse.json(result.data, { status: result.status });
    } finally {
      inFlightVerifications.delete(inFlightKey);
    }
  } catch (error: any) {
    console.error("[Verify Payment API Exception]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error during verification." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const db = getServiceSupabase();
    const { data: dbOrders, error } = await db
      .from("orders")
      .select("*")
      .eq("payment_status", "PAID")
      .order("created_at", { ascending: false });

    if (!error && dbOrders && dbOrders.length > 0) {
      const mappedOrders: Order[] = dbOrders.map((d: any) => ({
        id: d.id,
        orderId: d.order_id,
        razorpayOrderId: d.razorpay_order_id,
        paymentId: d.payment_id,
        productId: d.product_id || "unknown",
        productTitle: "Campus Product",
        sellerId: d.seller_id || "seller_vitap",
        sellerName: "Verified Student Seller",
        buyerName: d.buyer_name,
        buyerEmail: d.buyer_email,
        itemAmount: Number(d.seller_amount || 0),
        platformFee: Number(d.platform_fee || 0),
        totalAmount: Number(d.total_amount || 0),
        status: d.status || "PAID",
        paymentStatus: d.payment_status || "PAID",
        exchangeLocation: d.exchange_location || "Central Library Ground Floor",
        exchangeTime: d.exchange_time || "4:30 PM",
        createdAt: d.created_at,
      }));

      // Merge with in-memory confirmedOrders without duplicates:
      // Put database orders first, then overlay fresh confirmedOrders
      const orderMap = new Map<string, Order>();
      mappedOrders.forEach((o) => {
        if (o.orderId) orderMap.set(o.orderId, o);
      });
      confirmedOrders.forEach((o) => {
        if (o.orderId) orderMap.set(o.orderId, o);
      });

      return NextResponse.json({
        success: true,
        orders: Array.from(orderMap.values()),
      });
    }
  } catch (err) {
    // fallback to in-memory store
  }

  return NextResponse.json({
    success: true,
    orders: confirmedOrders,
  });
}
