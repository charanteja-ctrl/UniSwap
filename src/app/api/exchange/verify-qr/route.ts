import { NextRequest, NextResponse } from "next/server";
import { Order } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, qrToken, otp, scannedBy } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Order ID is required." },
        { status: 400 }
      );
    }

    if (!qrToken && !otp) {
      return NextResponse.json(
        { success: false, error: "Please provide either the scanned QR token or the 6-digit backup PIN." },
        { status: 400 }
      );
    }

    // In a production DB, fetch order from Supabase:
    // const { data: order } = await supabase.from('orders').select('*').eq('order_id', orderId).single();

    // Verify token structure or 6-digit OTP
    const isValidToken = qrToken ? qrToken.includes(orderId) || qrToken.startsWith("UNISWAP-") : true;
    const isValidOtp = otp ? otp.length >= 6 : true;

    if (!isValidToken && !isValidOtp) {
      return NextResponse.json(
        { success: false, error: "Invalid exchange token or expired PIN." },
        { status: 400 }
      );
    }

    const verifiedTimestamp = new Date().toISOString();

    const updatedOrder: Partial<Order> = {
      orderId,
      status: "COMPLETED",
      paymentStatus: "PAID",
      qrScannedAt: verifiedTimestamp,
      handoverConfirmedBy: scannedBy || "Verified Seller",
    };

    return NextResponse.json({
      success: true,
      message: "Campus exchange successfully verified at meetup point! Escrow payout released to seller.",
      order: updatedOrder,
      verifiedAt: verifiedTimestamp,
    });
  } catch (error: any) {
    console.error("[Verify QR Error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error verifying campus exchange." },
      { status: 500 }
    );
  }
}
