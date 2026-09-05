export type UserRole = "student" | "moderator" | "admin" | "super_admin";

export type Permission =
  | "PRODUCT_CREATE"
  | "PRODUCT_UPDATE"
  | "PRODUCT_DELETE"
  | "PRODUCT_FEATURE"
  | "ORDER_VIEW"
  | "ORDER_UPDATE"
  | "ORDER_CANCEL"
  | "OFFER_MAKE"
  | "OFFER_ACCEPT"
  | "OFFER_REJECT"
  | "CHAT_MESSAGE"
  | "REVIEW_SUBMIT"
  | "USER_VIEW"
  | "USER_SUSPEND"
  | "ROLE_ASSIGN"
  | "PAYMENT_VIEW"
  | "REFUND_MANAGE"
  | "FEE_CONFIG"
  | "REPORT_REVIEW"
  | "AUDIT_VIEW";

export interface StudentUser {
  id: string;
  name: string;
  email: string;
  regNo: string;
  hostel: string;
  role: UserRole;
  isVerified: boolean;
  avatar?: string;
  trustScore?: number; // 0 - 100
  successfulTrades?: number;
  rating?: number;
}

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
  coordinates?: { x: number; y: number };
}

export type ProductLifecycleStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "ACTIVE"
  | "RESERVED"
  | "SOLD"
  | "FLAGGED_MODERATION"
  | "ARCHIVED";

export interface Product {
  id: string;
  title: string;
  description: string;
  category: ItemCategory;
  price: number; // In Rupees (INR)
  condition: ItemCondition;
  images: string[];
  location: string; // e.g. "MH-2", "Library", "LH-1"
  status: ProductLifecycleStatus | "PENDING_MEETUP";
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
  saves?: number;
  createdAt: string;
}

export type OrderLifecycleStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "SELLER_CONFIRMED"
  | "READY_FOR_PICKUP"
  | "HANDED_OVER"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUND_REQUESTED"
  | "REFUNDED"
  | "DISPUTED";

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
  status: OrderLifecycleStatus | "EXCHANGE_SCHEDULED";
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  exchangeLocation: string;
  exchangeTime?: string;
  exchangeQrToken?: string;
  exchangeOtp?: string;     // 6-digit backup PIN
  qrScannedAt?: string;
  handoverConfirmedBy?: string;
  createdAt: string;
}

export interface Offer {
  id: string;
  productId: string;
  productTitle: string;
  productImage?: string;
  sellerId: string;
  sellerName: string;
  buyerId: string;
  buyerName: string;
  buyerRegNo: string;
  buyerEmail: string;
  originalPrice: number;
  offerPrice: number;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "COUNTERED";
  counterPrice?: number;
  meetupLocation?: string;
  message?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  productId: string;
  productTitle: string;
  senderId: string;
  senderName: string;
  senderRegNo: string;
  text: string;
  offerAmount?: number;
  isOfferCard?: boolean;
  timestamp: string;
}

export interface ReportItem {
  id: string;
  productId: string;
  productTitle: string;
  reportedBy: string;
  reportedEmail: string;
  reason: string;
  status: "PENDING" | "REVIEWED" | "RESOLVED" | "DISMISSED";
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  resource: string;
  resourceId?: string;
  details?: string;
  timestamp: string;
  ipAddress?: string;
}

export interface Review {
  id: string;
  orderId: string;
  productId: string;
  productTitle: string;
  reviewerId: string;
  reviewerName: string;
  reviewerRegNo: string;
  revieweeId: string;
  revieweeName: string;
  rating: number; // 1 - 5
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "OFFER" | "ORDER" | "CHAT" | "SYSTEM" | "ALERT";
  read: boolean;
  link?: string;
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

export interface VerifyQrRequest {
  orderId: string;
  qrToken?: string;
  otp?: string;
  scannedBy: string; // Seller Name / ID
}
