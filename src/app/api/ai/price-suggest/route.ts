import { NextRequest, NextResponse } from "next/server";
import { getGroqClient } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const { title, category, condition, originalPrice } = await req.json();

    if (!title) {
      return NextResponse.json(
        { error: "Product title is required." },
        { status: 400 }
      );
    }

    const origPriceNum = Number(originalPrice) || 1000;
    const groq = getGroqClient();

    const prompt = `You are the pricing intelligence engine for UniSwap, a university student marketplace at VIT-AP.
Analyze this item for resale among students:
- Item: ${title}
- Category: ${category || "General"}
- Condition: ${condition || "Good"}
- Original retail price: ₹${origPriceNum}

Calculate realistic campus resale pricing in Indian Rupees (INR) considering student budgets and campus demand.
Return ONLY valid JSON:
{
  "suggestedMinPrice": 450,
  "suggestedMaxPrice": 600,
  "demandRating": "HIGH" (must be "HIGH", "MEDIUM", or "NORMAL"),
  "reasoning": "Brief 1-2 sentence explanation of why this price is fair and what demand is like on campus."
}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "openai/gpt-oss-20b",
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    const content = chatCompletion.choices[0]?.message?.content || "{}";
    const result = JSON.parse(content);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("[Groq Price Suggester Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate price suggestion." },
      { status: 500 }
    );
  }
}
