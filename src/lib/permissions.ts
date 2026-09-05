import { Permission, StudentUser, UserRole } from "./types";

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  student: [
    "PRODUCT_CREATE",
    "PRODUCT_UPDATE",
    "ORDER_VIEW",
    "OFFER_MAKE",
    "CHAT_MESSAGE",
    "REVIEW_SUBMIT",
  ],
  moderator: [
    "PRODUCT_CREATE",
    "PRODUCT_UPDATE",
    "PRODUCT_DELETE",
    "ORDER_VIEW",
    "ORDER_UPDATE",
    "OFFER_MAKE",
    "OFFER_ACCEPT",
    "OFFER_REJECT",
    "CHAT_MESSAGE",
    "REVIEW_SUBMIT",
    "REPORT_REVIEW",
    "USER_VIEW",
    "AUDIT_VIEW",
  ],
  admin: [
    "PRODUCT_CREATE",
    "PRODUCT_UPDATE",
    "PRODUCT_DELETE",
    "PRODUCT_FEATURE",
    "ORDER_VIEW",
    "ORDER_UPDATE",
    "ORDER_CANCEL",
    "OFFER_MAKE",
    "OFFER_ACCEPT",
    "OFFER_REJECT",
    "CHAT_MESSAGE",
    "REVIEW_SUBMIT",
    "USER_VIEW",
    "USER_SUSPEND",
    "ROLE_ASSIGN",
    "PAYMENT_VIEW",
    "REFUND_MANAGE",
    "FEE_CONFIG",
    "REPORT_REVIEW",
    "AUDIT_VIEW",
  ],
  super_admin: [
    "PRODUCT_CREATE",
    "PRODUCT_UPDATE",
    "PRODUCT_DELETE",
    "PRODUCT_FEATURE",
    "ORDER_VIEW",
    "ORDER_UPDATE",
    "ORDER_CANCEL",
    "OFFER_MAKE",
    "OFFER_ACCEPT",
    "OFFER_REJECT",
    "CHAT_MESSAGE",
    "REVIEW_SUBMIT",
    "USER_VIEW",
    "USER_SUSPEND",
    "ROLE_ASSIGN",
    "PAYMENT_VIEW",
    "REFUND_MANAGE",
    "FEE_CONFIG",
    "REPORT_REVIEW",
    "AUDIT_VIEW",
  ],
};

/**
 * Checks whether a given user possesses a specific permission.
 */
export function hasPermission(user: StudentUser | null, permission: Permission): boolean {
  if (!user) return false;
  const userPermissions = ROLE_PERMISSIONS[user.role] || [];
  return userPermissions.includes(permission);
}

/**
 * Checks whether a user possesses at least one of the listed permissions.
 */
export function hasAnyPermission(user: StudentUser | null, permissions: Permission[]): boolean {
  if (!user) return false;
  return permissions.some((p) => hasPermission(user, p));
}

/**
 * Checks whether a user possesses all of the listed permissions.
 */
export function hasAllPermissions(user: StudentUser | null, permissions: Permission[]): boolean {
  if (!user) return false;
  return permissions.every((p) => hasPermission(user, p));
}

/**
 * Route protection helper based on permissions.
 */
export function canAccessRoute(user: StudentUser | null, routePath: string): boolean {
  if (!user) {
    if (routePath.startsWith("/login")) return true;
    return false;
  }

  if (routePath.startsWith("/admin")) {
    return hasAnyPermission(user, ["PAYMENT_VIEW", "REPORT_REVIEW", "ROLE_ASSIGN", "AUDIT_VIEW"]);
  }

  if (routePath.startsWith("/sell")) {
    return hasPermission(user, "PRODUCT_CREATE");
  }

  if (routePath.startsWith("/orders")) {
    return hasPermission(user, "ORDER_VIEW");
  }

  return true;
}
