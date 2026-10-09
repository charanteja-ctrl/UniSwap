import { NextRequest, NextResponse } from "next/server";
import { getRazorpayClient, calculatePlatformFee, checkRazorpayConfig } from "@/lib/razorpay";
import { INITIAL_PRODUCTS } from "@/lib/constants";
import { supabase, getServiceSupabase } from "@/lib/supabase";

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
      console.error("[Razorpay Server Error]:", configCheck.error);
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
    const { productId, buyerName, buyerEmail, exchangeLocation, exchangeTime } = body;

    // 2. Determine trusted price & calculate 2% platform fee
    let trustedSellerPrice = 0;
    let productTitle = body.productTitle || "Campus Product";

    // Lookup product in catalog to prevent price tampering
    const matchedProduct = INITIAL_PRODUCTS.find((p) => p.id === productId);
    if (matchedProduct) {
      trustedSellerPrice = matchedProduct.price;
      productTitle = matchedProduct.title;
    } else if (body.amount && typeof body.amount === "number" && !isNaN(body.amount)) {
      // Fallback: convert client-provided paise to seller price
      const totalRupees = Math.round(body.amount / 100);
      trustedSellerPrice = Math.max(1, Math.round(totalRupees / 1.02));
    } else {
      return NextResponse.json(
        { error: "Invalid product or amount specified for payment order." },
        { status: 400 }
      );
    }

    const feeBreakdown = calculatePlatformFee(trustedSellerPrice);
    const finalAmountPaise = feeBreakdown.totalAmountPaise;

    // Razorpay minimum charge is ₹1.00 (100 paise)
    if (finalAmountPaise < 100) {
      return NextResponse.json(
        { error: "Order total must be at least ₹1.00 (100 paise)." },
        { status: 400 }
      );
    }

    // 3. Initialize Razorpay Client
    let razorpay;
    try {
      razorpay = getRazorpayClient();
    } catch (authErr: any) {
      console.error("[Razorpay Auth Error]:", authErr.message);
      return NextResponse.json(
        { error: "Payment gateway initialization failed. " + authErr.message },
        { status: 500 }
      );
    }

    // 4. Create Razorpay Order
    const receiptId = `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const razorpayOrder = await razorpay.orders.create({
      amount: finalAmountPaise,
      currency: "INR",
      receipt: receiptId,
      notes: {
        platform: "UniSwap VIT-AP",
        productId: productId || "custom",
        productTitle: (productTitle || "").substring(0, 40),
        buyerEmail: buyerEmail || "",
        buyerName: buyerName || "",
        exchangeLocation: exchangeLocation || "Central Library Ground Desk",
        exchangeTime: exchangeTime || "Afternoon",
      },
    });

    if (!razorpayOrder || !razorpayOrder.id) {
      return NextResponse.json(
        { error: "Failed to create order on Razorpay payment network." },
        { status: 502 }
      );
    }

    // 5. Asynchronously persist PENDING order in Supabase if database is available
    try {
      const db = getServiceSupabase();
      await db.from("orders").insert([
        {
          order_id: razorpayOrder.id,
          razorpay_order_id: razorpayOrder.id,
          buyer_name: buyerName || "VIT-AP Student",
          buyer_email: buyerEmail || "student@vitap.ac.in",
          seller_amount: feeBreakdown.sellerAmount,
          platform_fee: feeBreakdown.platformFee,
          total_amount: feeBreakdown.totalAmount,
          status: "PENDING",
          payment_status: "PENDING",
          exchange_location: exchangeLocation || "Central Library",
          exchange_time: exchangeTime || "Afternoon",
        },
      ]);
    } catch (dbErr) {
      // Non-fatal: Supabase sync failure shouldn't abort checkout initiation
      console.warn("[Order Sync Notice]: Supabase DB order entry skipped or pending confirmation.", dbErr);
    }

    // 6. Return standard Razorpay checkout parameters
    return NextResponse.json({
      success: true,
      order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
      receipt: razorpayOrder.receipt,
      feeBreakdown: {
        sellerAmount: feeBreakdown.sellerAmount,
        platformFee: feeBreakdown.platformFee,
        totalAmount: feeBreakdown.totalAmount,
        feePercent: feeBreakdown.feePercent,
      },
    });
  } catch (error: any) {
    console.error("[Razorpay Order API Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error while creating Razorpay order." },
      { status: 500 }
    );
  }
}
