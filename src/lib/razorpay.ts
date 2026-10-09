import Razorpay from "razorpay";
import crypto from "crypto";

/**
 * Safely inspects Razorpay configuration status without logging or exposing secrets.
 */
export function checkRazorpayConfig(): {
  isConfigured: boolean;
  hasKeyId: boolean;
  hasKeySecret: boolean;
  keyIdPrefix?: string;
  error?: string;
} {
  const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  const hasKeyId = Boolean(key_id && key_id.trim().length > 0);
  const hasKeySecret = Boolean(key_secret && key_secret.trim().length > 0);

  if (!hasKeyId || !hasKeySecret) {
    const missing: string[] = [];
    if (!hasKeyId) missing.push("RAZORPAY_KEY_ID");
    if (!hasKeySecret) missing.push("RAZORPAY_KEY_SECRET");

    return {
      isConfigured: false,
      hasKeyId,
      hasKeySecret,
      error: `Razorpay credentials missing from server environment: ${missing.join(", ")}. Please configure them in the backend environment variables.`,
    };
  }

  return {
    isConfigured: true,
    hasKeyId: true,
    hasKeySecret: true,
    keyIdPrefix: key_id?.substring(0, 8), // Safe prefix e.g. "rzp_test"
  };
}

export function getRazorpayClient(): Razorpay {
  const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error(
      "Razorpay credentials (RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET) are missing from environment variables."
    );
  }

  return new Razorpay({
    key_id: key_id.trim(),
    key_secret: key_secret.trim(),
  });
}

/**
 * Calculates marketplace fee breakdown based on configurable platform fee percentage.
 * Example: Seller ₹1,000 + 2% fee (₹20) = ₹1,020 total.
 */
export function calculatePlatformFee(itemPriceInRupees: number) {
  const feePercent = Number(process.env.PLATFORM_FEE_PERCENT || 2);
  // Calculate fee in Rupees
  const rawFee = (itemPriceInRupees * feePercent) / 100;
  const fee = itemPriceInRupees > 0 ? Math.max(1, Math.round(rawFee)) : 0;
  const totalAmount = itemPriceInRupees + fee;

  return {
    feePercent,
    sellerAmount: itemPriceInRupees,
    platformFee: fee,
    totalAmount,
    totalAmountPaise: Math.round(totalAmount * 100),
  };
}

/**
 * Verifies the Razorpay payment signature using HMAC SHA256.
 * Format: HMAC-SHA256(order_id + "|" + payment_id, secret)
 */
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  razorpaySignature: string
): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    throw new Error("RAZORPAY_KEY_SECRET is not configured.");
  }

  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(generatedSignature, "utf-8"),
      Buffer.from(razorpaySignature, "utf-8")
    );
  } catch {
    return false;
  }
}
