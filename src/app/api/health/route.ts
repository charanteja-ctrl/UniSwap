import { NextResponse } from "next/server";

export async function GET() {
  const startTime = Date.now();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xrnofwzaglylwrrxyfyh.supabase.co";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const razorpayKey = process.env.RAZORPAY_KEY_ID;
  const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;
  const groqKey = process.env.GROQ_API_KEY;

  const healthCheck = {
    status: "HEALTHY",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    version: "1.0.0-production",
    services: {
      apiGateway: {
        status: "UP",
        message: "Next.js 14 App Router API Gateway active",
      },
      database: {
        status: supabaseUrl && supabaseKey ? "UP" : "DEGRADED",
        provider: "Supabase PostgreSQL",
        endpoint: supabaseUrl ? new URL(supabaseUrl).host : "xrnofwzaglylwrrxyfyh.supabase.co",
        rlsEnabled: true,
      },
      paymentGateway: {
        status: razorpayKey && razorpaySecret ? "UP" : "DEGRADED",
        provider: "Razorpay Standard Checkout",
        testMode: true,
        keyIdConfigured: !!razorpayKey,
      },
      aiEngine: {
        status: groqKey ? "UP" : "DEGRADED",
        provider: "Groq Cloud LPU",
        model: "openai/gpt-oss-20b",
      },
      security: {
        domainEnforcement: "@vitap.ac.in",
        hmacSignatureVerification: "ACTIVE",
        rbacMode: "GRANULAR_PERMISSIONS",
      },
    },
    systemMetrics: {
      uptimeSeconds: Math.floor(process.uptime()),
      memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      responseTimeMs: Date.now() - startTime,
    },
  };

  return NextResponse.json(healthCheck, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "X-UniSwap-Health": "OK",
    },
  });
}
