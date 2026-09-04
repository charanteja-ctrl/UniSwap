export type ItemCategory = 
  | "Books"
  | "Calculators"
  | "Electronics"
  | "Stationery"
  | "Academic/Lab"
  | "Bags"
  | "Hostel Essentials"
  | "Others"
  | "Free"
  | "Swap";

export type ItemCondition = "Like New" | "Good" | "Fair" | "Needs Repair";

export interface CampusLocation {
  id: string;
  name: string;
  type: "Hostel" | "Academic" | "Recreation" | "Dining";
  code: string;
  description: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  category: ItemCategory;
  price: number; // In Rupees (INR)
  condition: ItemCondition;
  images: string[];
  location: string; // e.g. "MH-2", "Library", "LH-1"
  status: "ACTIVE" | "PENDING_MEETUP" | "SOLD";
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
  sellerVerified: boolean;
  sellerRating: number;
  sellerHostel?: string;
  isSwapAvailable?: boolean;
  swapFor?: string;
  isFree?: boolean;
  demandRating?: "HIGH" | "MEDIUM" | "NORMAL";
  views?: number;
  createdAt: string;
}

export interface Order {
  id: string;
  orderId: string;
  razorpayOrderId?: string;
  paymentId?: string;
  signature?: string;
  productId: string;
  productTitle: string;
  productImage?: string;
  sellerId: string;
  sellerName: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  itemAmount: number;     // Seller's cut (₹)
  platformFee: number;    // UniSwap 2% cut (₹)
  totalAmount: number;    // Paid by student (₹)
  status: "PENDING" | "PAID" | "SELLER_CONFIRMED" | "EXCHANGE_SCHEDULED" | "COMPLETED" | "CANCELLED";
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  exchangeLocation: string;
  exchangeTime?: string;
  createdAt: string;
}

export interface CreateOrderRequest {
  amount: number; // in Paise (e.g. ₹350 = 35000 paise)
  productId: string;
  productTitle: string;
  buyerName: string;
  buyerEmail: string;
  exchangeLocation: string;
  exchangeTime?: string;
}

export interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  orderDetails: {
    productId: string;
    productTitle: string;
    buyerName: string;
    buyerEmail: string;
    exchangeLocation: string;
    exchangeTime?: string;
    itemAmount: number;
    platformFee: number;
    totalAmount: number;
  };
}
