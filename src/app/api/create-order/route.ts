import { NextRequest, NextResponse } from "next/server";
import { getRazorpayClient, calculatePlatformFee } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, productId, productTitle, buyerName, buyerEmail, exchangeLocation, exchangeTime } = body;

    // 1. Validation
    if (!amount || typeof amount !== "number" || isNaN(amount)) {
      return NextResponse.json(
        { error: "Invalid amount. Amount must be provided in paise as a number." },
        { status: 400 }
      );
    }

    // Minimum 100 paise (₹1) as required by Razorpay
    if (amount < 100) {
      return NextResponse.json(
        { error: "Amount must be at least 100 paise (₹1.00)." },
        { status: 400 }
      );
    }

    // 2. Initialize Razorpay Client
    let razorpay;
    try {
      razorpay = getRazorpayClient();
    } catch (authErr: any) {
      console.error("[Razorpay Auth Error]:", authErr);
      return NextResponse.json(
        { error: "Payment gateway authentication failed: " + authErr.message },
        { status: 401 }
      );
    }

    // 3. Platform Fee Calculation (2% default)
    // Convert paise to rupees for fee breakdown calculation
    const totalRupees = Math.round(amount / 100);
    const sellerRupees = Math.round(totalRupees / 1.02);
    const feeBreakdown = calculatePlatformFee(sellerRupees);

    // 4. Create Razorpay Order
    const receiptId = `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount), // in paise
      currency: "INR",
      receipt: receiptId,
      notes: {
        platform: "UniSwap VIT-AP",
        productId: productId || "unknown",
        productTitle: (productTitle || "").substring(0, 40),
        buyerEmail: buyerEmail || "",
        buyerName: buyerName || "",
        exchangeLocation: exchangeLocation || "Central Library",
        exchangeTime: exchangeTime || "Afternoon",
      },
    });

    if (!razorpayOrder || !razorpayOrder.id) {
      return NextResponse.json(
        { error: "Failed to create order with Razorpay." },
        { status: 500 }
      );
    }

    // Return the response as required: order_id, amount, currency
    return NextResponse.json({
      success: true,
      order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      receipt: razorpayOrder.receipt,
      feeBreakdown: {
        sellerAmount: feeBreakdown.sellerAmount,
        platformFee: feeBreakdown.platformFee,
        totalAmount: totalRupees,
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
