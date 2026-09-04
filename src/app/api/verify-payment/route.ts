import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { Order } from "@/lib/types";

// In-memory persistent order record for fast dev & fallback before Supabase sync
const confirmedOrders: Order[] = [];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderDetails,
    } = body;

    // 1. Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required verification fields (razorpay_order_id, razorpay_payment_id, razorpay_signature).",
        },
        { status: 400 }
      );
    }

    // 2. Check Razorpay Secret & Verify Signature
    let isValid = false;
    try {
      isValid = verifyRazorpaySignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );
    } catch (err: any) {
      console.error("[Signature Verification Error]:", err);
      return NextResponse.json(
        { success: false, error: err.message || "Failed to verify signature." },
        { status: 500 }
      );
    }

    if (!isValid) {
      // Reject mismatch
      console.warn(`[Razorpay Security Alert]: Signature mismatch for order ${razorpay_order_id}`);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid payment signature. Verification failed.",
        },
        { status: 400 }
      );
    }

    // 3. Mark as PAID and create order confirmation
    const orderRecord: Order = {
      id: `order_${Date.now()}`,
      orderId: razorpay_order_id,
      razorpayOrderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      productId: orderDetails?.productId || "unknown",
      productTitle: orderDetails?.productTitle || "Campus Item",
      productImage: orderDetails?.productImage,
      sellerId: orderDetails?.sellerId || "seller_vitap",
      sellerName: orderDetails?.sellerName || "Verified Student",
      buyerName: orderDetails?.buyerName || "VIT-AP Student",
      buyerEmail: orderDetails?.buyerEmail || "student@vitap.ac.in",
      itemAmount: orderDetails?.itemAmount || 0,
      platformFee: orderDetails?.platformFee || 0,
      totalAmount: orderDetails?.totalAmount || 0,
      status: "PAID",
      paymentStatus: "PAID",
      exchangeLocation: orderDetails?.exchangeLocation || "Central Library Ground Floor",
      exchangeTime: orderDetails?.exchangeTime || "Tomorrow at 4:30 PM",
      createdAt: new Date().toISOString(),
    };

    confirmedOrders.unshift(orderRecord);

    return NextResponse.json({
      success: true,
      message: "Payment signature verified successfully.",
      order: orderRecord,
    });
  } catch (error: any) {
    console.error("[Verify Payment API Error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error during verification." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    orders: confirmedOrders,
  });
}
