import { NextRequest, NextResponse } from "next/server";
import { getGroqClient } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const { message, conversationHistory } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const groq = getGroqClient();

    const systemPrompt = `You are "UniSwap Assistant", the official AI helper for UniSwap — VIT-AP University's student-to-student marketplace.
Here is what you know about the platform:
- University: VIT-AP University (Amaravati campus).
- Who can join: Only verified students with @vitap.ac.in emails.
- Safety & Payments: Payments are securely held via Razorpay Standard Checkout. Customer pays Item Price + 2% platform fee (e.g. ₹1,000 item + ₹20 UniSwap fee = ₹1,020 total).
- Campus Exchange Points: Pre-designated safe meetup spots include Central Library Ground Floor (near 24/7 desk), Food Street / Canteen, Student Activity Center (SAC), Academic Block 1 & 2, and Men's/Ladies' Hostels (MH-1, MH-2, MH-3, LH-1, LH-2).
- Key features: Buy Now with UPI/cards, Make an Offer, Swap mode (book for book / gadget for gadget), and 🎁 Free items section for seniors donating notes and essentials.
- Tone: Friendly, campus-savvy, concise, helpful, and focused on student safety and affordability.`;

    const messages: any[] = [{ role: "system", content: systemPrompt }];

    if (Array.isArray(conversationHistory)) {
      conversationHistory.slice(-4).forEach((msg) => {
        messages.push({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text,
        });
      });
    }

    messages.push({ role: "user", content: message });

    const chatCompletion = await groq.chat.completions.create({
      messages,
      model: "openai/gpt-oss-20b",
      temperature: 0.5,
      max_tokens: 350,
    });

    const reply = chatCompletion.choices[0]?.message?.content || "I'm here to help with UniSwap at VIT-AP!";

    return NextResponse.json({
      success: true,
      reply,
    });
  } catch (error: any) {
    console.error("[Groq Chat Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to contact UniSwap AI." },
      { status: 500 }
    );
  }
}
