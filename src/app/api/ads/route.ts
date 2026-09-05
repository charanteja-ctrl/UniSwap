import { NextResponse } from "next/server";
import { Advertisement, AdStatus } from "@/lib/types";

let adsStore: Advertisement[] = [
  {
    id: "ad-101",
    title: "TechFest 2026: Annual VIT-AP Hackathon & AI Summit",
    tagline: "48-Hour Hackathon with ₹2,00,000 Cash Prizes & Internship Offers",
    category: "TECH_EVENT",
    advertiserType: "CLUB",
    advertiserName: "IEEE VIT-AP Student Branch",
    advertiserVerified: true,
    bannerUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80",
    eventDate: "March 15-17, 2026",
    location: "University Auditorium & AB-2 Labs",
    actionUrl: "https://vitap.ac.in/events/techfest",
    actionText: "Register Free via Student ID",
    packageType: "CAMPUS_FEATURED",
    pricePaid: 1999,
    status: "APPROVED",
    impressions: 14250,
    clicks: 1920,
    conversions: 412,
    createdAt: "2026-09-01T10:00:00Z",
  },
  {
    id: "ad-102",
    title: "Campus Pizza & Pasta: Flat 20% Off for Students",
    tagline: "Show your UniSwap Student Badge or use code CAMPUSPIZZA20",
    category: "RESTAURANT",
    advertiserType: "BUSINESS",
    advertiserName: "Campus Pizza & Cafe (Rock Plaza)",
    advertiserVerified: true,
    bannerUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&auto=format&fit=crop&q=80",
    dealDiscount: "Flat 20% Student Discount",
    couponCode: "CAMPUSPIZZA20",
    location: "Rock Plaza Dining Complex, Ground Floor",
    actionUrl: "#",
    actionText: "Claim 20% Coupon Code",
    packageType: "PREMIUM",
    pricePaid: 999,
    status: "APPROVED",
    impressions: 8900,
    clicks: 1240,
    conversions: 285,
    createdAt: "2026-09-02T14:30:00Z",
  },
  {
    id: "ad-103",
    title: "IronFit 24/7 Campus Gym & Crossfit Membership",
    tagline: "Semester pass for ₹1,200/month with student trainer assistance",
    category: "GYM",
    advertiserType: "BUSINESS",
    advertiserName: "IronFit Fitness Studio",
    advertiserVerified: true,
    bannerUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop&q=80",
    dealDiscount: "₹300 Off Semester Pass",
    couponCode: "VITAPFIT",
    location: "Opposite VIT-AP Main Security Gate",
    actionUrl: "#",
    actionText: "View Student Memberships",
    packageType: "BASIC",
    pricePaid: 499,
    status: "APPROVED",
    impressions: 6120,
    clicks: 780,
    conversions: 145,
    createdAt: "2026-09-03T09:15:00Z",
  },
  {
    id: "ad-104",
    title: "ACM Robotics Workshop: Autonomous Drones & ROS",
    tagline: "Hands-on hardware lab for CSE, ECE & Mechanical branches",
    category: "CAMPUS_CLUB",
    advertiserType: "CLUB",
    advertiserName: "ACM Student Chapter",
    advertiserVerified: true,
    bannerUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&auto=format&fit=crop&q=80",
    eventDate: "March 22, 2026",
    location: "Academic Block 1 (AB-1) Room 204",
    actionUrl: "#",
    actionText: "Join Drone Workshop",
    packageType: "PREMIUM",
    pricePaid: 999,
    status: "UNDER_REVIEW", // Under Review waiting for Master Admin!
    impressions: 0,
    clicks: 0,
    conversions: 0,
    createdAt: "2026-09-05T08:00:00Z",
  },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const statusFilter = searchParams.get("status");

  let filtered = adsStore;
  if (statusFilter) {
    filtered = adsStore.filter((ad) => ad.status === statusFilter);
  }

  return NextResponse.json({
    success: true,
    ads: filtered,
    metrics: {
      totalCampaigns: adsStore.length,
      activeApproved: adsStore.filter((a) => a.status === "APPROVED").length,
      pendingReview: adsStore.filter((a) => a.status === "UNDER_REVIEW").length,
      totalAdRevenue: adsStore.reduce((acc, a) => acc + (a.status === "APPROVED" ? a.pricePaid : 0), 0),
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      tagline,
      category,
      advertiserType,
      advertiserName,
      bannerUrl,
      dealDiscount,
      couponCode,
      eventDate,
      location,
      actionText,
      packageType,
    } = body;

    if (!title || !advertiserName) {
      return NextResponse.json(
        { success: false, error: "Title and Advertiser Name are required." },
        { status: 400 }
      );
    }

    const priceMap: Record<string, number> = {
      BASIC: 499,
      PREMIUM: 999,
      CAMPUS_FEATURED: 1999,
    };

    const newAd: Advertisement = {
      id: `ad-${Date.now()}`,
      title,
      tagline: tagline || "Exclusive campus announcement for VIT-AP students",
      category: category || (advertiserType === "CLUB" ? "CAMPUS_CLUB" : "RESTAURANT"),
      advertiserType: advertiserType || "BUSINESS",
      advertiserName,
      advertiserVerified: true,
      bannerUrl: bannerUrl || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80",
      dealDiscount,
      couponCode,
      eventDate,
      location: location || "VIT-AP Campus Grounds",
      actionText: actionText || "Learn More",
      packageType: packageType || "PREMIUM",
      pricePaid: priceMap[packageType] || 999,
      status: "UNDER_REVIEW", // Enforces review workflow
      impressions: 0,
      clicks: 0,
      conversions: 0,
      createdAt: new Date().toISOString(),
    };

    adsStore.unshift(newAd);

    return NextResponse.json({
      success: true,
      ad: newAd,
      message: "Campaign submitted for review! Master Admin or Moderator approval required before publishing.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create advertisement" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { adId, action } = body;

    const adIndex = adsStore.findIndex((a) => a.id === adId);
    if (adIndex === -1) {
      return NextResponse.json({ success: false, error: "Ad not found" }, { status: 404 });
    }

    if (action === "APPROVE") {
      adsStore[adIndex].status = "APPROVED";
    } else if (action === "REJECT") {
      adsStore[adIndex].status = "REJECTED";
    } else if (action === "PAUSE") {
      adsStore[adIndex].status = "PAUSED";
    }

    return NextResponse.json({
      success: true,
      ad: adsStore[adIndex],
      message: `Advertisement status changed to ${adsStore[adIndex].status}.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update ad status" },
      { status: 500 }
    );
  }
}
