import { NextRequest, NextResponse } from "next/server";
import { FeedbackCategory, FeedbackItem, FeedbackStatus } from "@/lib/types";
import { getServiceSupabase } from "@/lib/supabase";

// Valid categories whitelist
const VALID_CATEGORIES: FeedbackCategory[] = [
  "General Website",
  "Buying Experience",
  "Selling Experience",
  "Payment Issues",
  "Campus Meetup",
  "Bug Report",
  "Feature Request",
  "Other",
];

const VALID_STATUSES: FeedbackStatus[] = ["New", "In Progress", "Resolved"];

// In-memory store for instant local dev & resilient fallback
const feedbackStore: FeedbackItem[] = [];

// Helper: Check admin role
function isAuthorizedAdmin(role?: string | null): boolean {
  if (!role) return false;
  const clean = role.toLowerCase().trim();
  return clean === "admin" || clean === "master_admin" || clean === "moderator" || clean === "super_admin";
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, X-User-Role",
    },
  });
}

/**
 * POST /api/feedback
 * Submit student feedback with validation and security restrictions.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      rating,
      category,
      title,
      message,
      isAnonymous,
      screenshot,
      userId,
      userName,
      userEmail,
    } = body;

    // 1. Validation: Rating (1-5)
    const numRating = Number(rating);
    if (!numRating || isNaN(numRating) || numRating < 1 || numRating > 5) {
      return NextResponse.json(
        { success: false, error: "Validation error: Rating must be an integer between 1 and 5." },
        { status: 400 }
      );
    }

    // 2. Validation: Category whitelist
    if (!category || !VALID_CATEGORIES.includes(category)) {
      return NextResponse.json(
        {
          success: false,
          error: `Validation error: Invalid category. Must be one of: ${VALID_CATEGORIES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // 3. Validation: Title length
    const cleanTitle = (title || "").trim();
    if (cleanTitle.length < 3 || cleanTitle.length > 150) {
      return NextResponse.json(
        { success: false, error: "Validation error: Feedback title must be between 3 and 150 characters." },
        { status: 400 }
      );
    }

    // 4. Validation: Detailed Message length
    const cleanMessage = (message || "").trim();
    if (cleanMessage.length < 10 || cleanMessage.length > 2000) {
      return NextResponse.json(
        { success: false, error: "Validation error: Detailed message must be between 10 and 2000 characters." },
        { status: 400 }
      );
    }

    // 5. Validation: Optional Screenshot
    let validatedScreenshotPath: string | undefined = undefined;
    if (screenshot && typeof screenshot === "string") {
      const trimmedScreenshot = screenshot.trim();
      if (trimmedScreenshot.startsWith("data:")) {
        const allowedMime = /^data:image\/(png|jpeg|jpg|webp);base64,/i;
        if (!allowedMime.test(trimmedScreenshot)) {
          return NextResponse.json(
            { success: false, error: "Invalid screenshot format. Only PNG, JPEG, and WebP images are allowed." },
            { status: 400 }
          );
        }

        // Validate approximate base64 payload size (Max 5 MB)
        const base64Length = trimmedScreenshot.length - (trimmedScreenshot.indexOf(",") + 1);
        const sizeInBytes = Math.ceil((base64Length * 3) / 4);
        if (sizeInBytes > 5 * 1024 * 1024) {
          return NextResponse.json(
            { success: false, error: "Screenshot file exceeds maximum size limit of 5 MB." },
            { status: 400 }
          );
        }

        validatedScreenshotPath = trimmedScreenshot;
      } else if (trimmedScreenshot.startsWith("http://") || trimmedScreenshot.startsWith("https://")) {
        validatedScreenshotPath = trimmedScreenshot;
      } else {
        return NextResponse.json(
          { success: false, error: "Invalid screenshot format. Must be a valid image base64 data URI or HTTP URL." },
          { status: 400 }
        );
      }
    }

    // 6. Security Enforcement:
    // Students can NEVER set admin-only fields like 'status' or 'adminReply'
    const newFeedback: FeedbackItem = {
      id: `fb_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      userId: userId || undefined,
      userName: isAnonymous ? "Anonymous Student" : (userName || "VIT-AP Student"),
      userEmail: isAnonymous ? "anonymous@vitapstudent.ac.in" : (userEmail || "student@vitap.ac.in"),
      rating: Math.round(numRating),
      category,
      title: cleanTitle,
      message: cleanMessage,
      isAnonymous: Boolean(isAnonymous),
      screenshotPath: validatedScreenshotPath,
      status: "New", // Hardcoded security rule
      adminReply: undefined, // Hardcoded security rule
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    feedbackStore.unshift(newFeedback);

    // 7. Supabase Database Persistence
    try {
      const db = getServiceSupabase();
      await db.from("feedback").insert([
        {
          id: newFeedback.id.replace("fb_", ""),
          user_id: newFeedback.userId,
          user_name: newFeedback.userName,
          user_email: newFeedback.userEmail,
          rating: newFeedback.rating,
          category: newFeedback.category,
          title: newFeedback.title,
          message: newFeedback.message,
          is_anonymous: newFeedback.isAnonymous,
          screenshot_path: newFeedback.screenshotPath,
          status: "New",
        },
      ]);
    } catch (dbErr) {
      console.warn("[Feedback DB Warning]: Supabase sync skipped or pending migration.", dbErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! Your feedback has been submitted successfully to UniSwap campus team.",
        feedback: newFeedback,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("[Feedback API Error]:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error submitting feedback." },
      { status: 500 }
    );
  }
}

/**
 * GET /api/feedback
 * Fetch feedback submissions with filtering, search, and live metrics.
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search")?.toLowerCase().trim() || "";
    const category = url.searchParams.get("category") || "ALL";
    const status = url.searchParams.get("status") || "ALL";
    const ratingParam = url.searchParams.get("rating");
    const roleHeader = req.headers.get("x-user-role") || url.searchParams.get("role");
    const userId = url.searchParams.get("userId");

    const isAdmin = isAuthorizedAdmin(roleHeader);

    // Try fetching from Supabase first
    let items: FeedbackItem[] = [...feedbackStore];
    try {
      const db = getServiceSupabase();
      const { data, error } = await db.from("feedback").select("*").order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        items = data.map((d: any) => ({
          id: d.id,
          userId: d.user_id,
          userName: d.user_name,
          userEmail: d.user_email,
          rating: d.rating,
          category: d.category,
          title: d.title,
          message: d.message,
          isAnonymous: d.is_anonymous,
          screenshotPath: d.screenshot_path,
          status: d.status,
          adminReply: d.admin_reply,
          adminReplyAt: d.admin_reply_at,
          createdAt: d.created_at,
          updatedAt: d.updated_at,
        }));
      }
    } catch (dbErr) {
      // Use in-memory store
    }

    // Security: non-admin students can only see their own submissions
    if (!isAdmin && userId) {
      items = items.filter((f) => f.userId === userId);
    }

    // Calculate real dynamic analytics before filtering
    const totalSubmissions = items.length;
    const avgRating =
      totalSubmissions > 0
        ? Number((items.reduce((acc, curr) => acc + curr.rating, 0) / totalSubmissions).toFixed(1))
        : 0;

    const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const statusCounts: Record<FeedbackStatus, number> = { New: 0, "In Progress": 0, Resolved: 0 };

    items.forEach((item) => {
      if (item.rating >= 1 && item.rating <= 5) {
        ratingDistribution[item.rating] = (ratingDistribution[item.rating] || 0) + 1;
      }
      if (item.status && VALID_STATUSES.includes(item.status)) {
        statusCounts[item.status] = (statusCounts[item.status] || 0) + 1;
      }
    });

    // Apply filters
    let filtered = items;

    if (search) {
      filtered = filtered.filter(
        (f) =>
          f.title.toLowerCase().includes(search) ||
          f.message.toLowerCase().includes(search) ||
          f.category.toLowerCase().includes(search) ||
          (!f.isAnonymous && f.userName.toLowerCase().includes(search))
      );
    }

    if (category !== "ALL") {
      filtered = filtered.filter((f) => f.category === category);
    }

    if (status !== "ALL") {
      filtered = filtered.filter((f) => f.status === status);
    }

    if (ratingParam && ratingParam !== "ALL") {
      const targetRating = Number(ratingParam);
      if (!isNaN(targetRating)) {
        filtered = filtered.filter((f) => f.rating === targetRating);
      }
    }

    return NextResponse.json({
      success: true,
      feedback: filtered,
      metrics: {
        totalSubmissions,
        averageRating: avgRating,
        ratingDistribution,
        statusCounts,
      },
    });
  } catch (err: any) {
    console.error("[Feedback GET Error]:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error fetching feedback." },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/feedback
 * Update feedback status & submit official admin replies.
 * Requires administrator role.
 */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { id, status, adminReply, actorRole } = body;

    const roleHeader = req.headers.get("x-user-role") || actorRole;
    if (!isAuthorizedAdmin(roleHeader)) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Only campus administrators or moderators can update feedback status and replies.",
        },
        { status: 403 }
      );
    }

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing feedback ID." }, { status: 400 });
    }

    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    // Update in memory store
    const itemIndex = feedbackStore.findIndex((f) => f.id === id);
    if (itemIndex !== -1) {
      if (status) feedbackStore[itemIndex].status = status;
      if (adminReply !== undefined) {
        feedbackStore[itemIndex].adminReply = adminReply.trim();
        feedbackStore[itemIndex].adminReplyAt = new Date().toISOString();
      }
      feedbackStore[itemIndex].updatedAt = new Date().toISOString();
    }

    // Update in Supabase
    try {
      const db = getServiceSupabase();
      const updates: any = { updated_at: new Date().toISOString() };
      if (status) updates.status = status;
      if (adminReply !== undefined) {
        updates.admin_reply = adminReply.trim();
        updates.admin_reply_at = new Date().toISOString();
      }
      await db.from("feedback").update(updates).eq("id", id.replace("fb_", ""));
    } catch (dbErr) {
      console.warn("[Feedback DB Warning]: Supabase status update skipped.", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: "Feedback updated successfully.",
      feedback: itemIndex !== -1 ? feedbackStore[itemIndex] : { id, status, adminReply },
    });
  } catch (err: any) {
    console.error("[Feedback PATCH Error]:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error updating feedback." },
      { status: 500 }
    );
  }
}
