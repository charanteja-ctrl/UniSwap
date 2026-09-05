import { NextResponse } from "next/server";
import { Offer } from "@/lib/types";

// In-memory / persistent mock store for demo
let offersStore: Offer[] = [
  {
    id: "off-101",
    productId: "prod-1",
    productTitle: "Casio FX-991CW ClassWiz Scientific Calculator",
    sellerId: "user-rahul",
    sellerName: "Rahul Sharma (MH-2)",
    buyerId: "usr_student_charan",
    buyerName: "Charan Teja",
    buyerRegNo: "23BCE1024",
    buyerEmail: "charan.23bce1024@vitap.ac.in",
    originalPrice: 850,
    offerPrice: 750,
    status: "ACCEPTED",
    meetupLocation: "Central Library Ground Floor",
    message: "Hey Rahul, can you do ₹750? I can meet at Central Library right after 4 PM class.",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "off-102",
    productId: "prod-3",
    productTitle: "Hercules Street Cat Pro Bicycle (6-Gear)",
    sellerId: "user-rahul",
    sellerName: "Rahul Sharma (MH-2)",
    buyerId: "usr_student_priya",
    buyerName: "Priya Venkatesh",
    buyerRegNo: "23BCE1420",
    buyerEmail: "priya.23bce1420@vitap.ac.in",
    originalPrice: 3200,
    offerPrice: 2800,
    status: "PENDING",
    meetupLocation: "Gazebo near Men's Hostel 1",
    message: "Is ₹2,800 acceptable? Ready for immediate UPI transfer.",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

export async function GET(req: Request) {
  return NextResponse.json({
    success: true,
    offers: offersStore,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      productId,
      productTitle,
      sellerId,
      sellerName,
      buyerId,
      buyerName,
      buyerRegNo,
      buyerEmail,
      originalPrice,
      offerPrice,
      meetupLocation,
      message,
    } = body;

    if (!productId || !offerPrice || offerPrice <= 0) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid positive offer amount in Rupees." },
        { status: 400 }
      );
    }

    if (offerPrice >= originalPrice) {
      return NextResponse.json(
        { success: false, error: "Offer amount should be lower than the listed asking price." },
        { status: 400 }
      );
    }

    const newOffer: Offer = {
      id: `off-${Date.now()}`,
      productId,
      productTitle: productTitle || "Campus Item",
      sellerId: sellerId || "user-seller",
      sellerName: sellerName || "Campus Peer",
      buyerId: buyerId || "usr_student",
      buyerName: buyerName || "VIT-AP Student",
      buyerRegNo: buyerRegNo || "23BCE1024",
      buyerEmail: buyerEmail || "student@vitap.ac.in",
      originalPrice: Number(originalPrice),
      offerPrice: Number(offerPrice),
      status: "PENDING",
      meetupLocation: meetupLocation || "Central Library Ground Floor",
      message: message || "Proposed a student offer for this item.",
      createdAt: new Date().toISOString(),
    };

    offersStore.unshift(newOffer);

    return NextResponse.json({
      success: true,
      offer: newOffer,
      message: "Offer submitted to seller! You will be notified when accepted.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to submit offer" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { offerId, action, counterPrice } = body;

    const offerIndex = offersStore.findIndex((o) => o.id === offerId);
    if (offerIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Offer not found." },
        { status: 404 }
      );
    }

    if (action === "ACCEPT") {
      offersStore[offerIndex].status = "ACCEPTED";
    } else if (action === "REJECT") {
      offersStore[offerIndex].status = "REJECTED";
    } else if (action === "COUNTER" && counterPrice) {
      offersStore[offerIndex].status = "COUNTERED";
      offersStore[offerIndex].counterPrice = Number(counterPrice);
    }

    return NextResponse.json({
      success: true,
      offer: offersStore[offerIndex],
      message: `Offer has been ${offersStore[offerIndex].status.toLowerCase()}.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update offer" },
      { status: 500 }
    );
  }
}
