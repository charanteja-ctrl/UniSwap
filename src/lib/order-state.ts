import { OrderLifecycleStatus } from "./types";

export interface StateTransitionResult {
  valid: boolean;
  message?: string;
}

const ALLOWED_TRANSITIONS: Record<OrderLifecycleStatus, OrderLifecycleStatus[]> = {
  PENDING_PAYMENT: ["PAID", "CANCELLED"],
  PAID: ["SELLER_CONFIRMED", "READY_FOR_PICKUP", "REFUND_REQUESTED", "CANCELLED"],
  SELLER_CONFIRMED: ["READY_FOR_PICKUP", "REFUND_REQUESTED"],
  READY_FOR_PICKUP: ["HANDED_OVER", "COMPLETED", "DISPUTED"],
  HANDED_OVER: ["COMPLETED", "DISPUTED"],
  COMPLETED: [], // Terminal happy path
  CANCELLED: [], // Terminal cancel
  REFUND_REQUESTED: ["REFUNDED", "DISPUTED", "SELLER_CONFIRMED"],
  REFUNDED: [], // Terminal refund
  DISPUTED: ["REFUNDED", "COMPLETED"],
};

export const ORDER_LIFECYCLE_STEPS: {
  status: OrderLifecycleStatus;
  label: string;
  description: string;
}[] = [
  {
    status: "PAID",
    label: "Payment Verified",
    description: "Razorpay HMAC signature verified & escrow funds held",
  },
  {
    status: "SELLER_CONFIRMED",
    label: "Seller Confirmed",
    description: "Seller notified & preparing item for handover",
  },
  {
    status: "READY_FOR_PICKUP",
    label: "Ready for Meetup",
    description: "Meetup scheduled at designated campus spot",
  },
  {
    status: "HANDED_OVER",
    label: "QR Verified",
    description: "Peer inspected item & confirmed QR / OTP exchange",
  },
  {
    status: "COMPLETED",
    label: "Completed & Settled",
    description: "Escrow payment released to seller (2% fee retained)",
  },
];

export function validateOrderTransition(
  currentStatus: OrderLifecycleStatus,
  nextStatus: OrderLifecycleStatus
): StateTransitionResult {
  if (currentStatus === nextStatus) {
    return { valid: true };
  }

  const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];
  if (allowed.includes(nextStatus)) {
    return { valid: true };
  }

  return {
    valid: false,
    message: `Invalid order state transition from ${currentStatus} to ${nextStatus}. Illegal operation prevented.`,
  };
}

export function getOrderStepIndex(status: string): number {
  switch (status) {
    case "PENDING_PAYMENT":
      return 0;
    case "PAID":
      return 1;
    case "SELLER_CONFIRMED":
      return 2;
    case "READY_FOR_PICKUP":
    case "EXCHANGE_SCHEDULED":
      return 3;
    case "HANDED_OVER":
      return 4;
    case "COMPLETED":
      return 5;
    default:
      return 1;
  }
}
