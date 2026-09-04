import { NextRequest, NextResponse } from "next/server";
import { getGroqClient } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const { roughDescription } = await req.json();

    if (!roughDescription || typeof roughDescription !== "string") {
      return NextResponse.json(
        { error: "Please provide a rough description of the item." },
        { status: 400 }
      );
    }

    const groq = getGroqClient();

    const prompt = `You are the listing assistant for UniSwap (a campus marketplace for VIT-AP University students).
A student provided this informal item summary:
"${roughDescription}"

Convert this into an attractive, crisp, student-friendly marketplace listing.
Return ONLY valid JSON with the following structure (no markdown fences, no extra text):
{
  "title": "Clear, appealing title under 60 chars",
  "description": "2-3 sentences explaining condition, usage, and why it's useful for students",
  "category": "One of: Books, Calculators, Electronics, Stationery, Academic/Lab, Bags, Hostel Essentials, Others",
  "condition": "One of: Like New, Good, Fair, Needs Repair",
  "suggestedPrice": 500,
  "tags": ["tag1", "tag2"]
}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "openai/gpt-oss-20b",
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const content = chatCompletion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(content);

    return NextResponse.json({
      success: true,
      data: parsed,
    });
  } catch (error: any) {
    console.error("[Groq Listing Generator Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate listing with AI." },
      { status: 500 }
    );
  }
}
