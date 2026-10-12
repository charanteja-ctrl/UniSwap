// =========================================================================
// UniSwap Dedicated Express Payment Backend Server
// =========================================================================
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// 1. Auto-load .env.local for local development if present
function loadLocalEnv() {
  const envPath = path.join(__dirname, ".env.local");
  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, "utf8");
      content.split("\n").forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
          const idx = trimmed.indexOf("=");
          const key = trimmed.substring(0, idx).trim();
          const val = trimmed.substring(idx + 1).trim();
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      });
      console.log("[Express Server]: Loaded environment configuration from .env.local");
    } catch (e) {
      console.warn("[Express Server]: Notice: Could not read .env.local file", e.message);
    }
  }
}
loadLocalEnv();

const Razorpay = require("razorpay");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = process.env.PORT || 10000;

// 2. Global Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "X-User-Role",
      "Accept",
    ],
  })
);

// Register body parser for JSON request bodies BEFORE routes
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// 3. Supabase & Razorpay Client Helpers
function getSupabaseClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xrnofwzaglylwrrxyfyh.supabase.co";
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  if (!supabaseKey) {
    return null;
  }
  return createClient(supabaseUrl, supabaseKey);
}

function checkRazorpayConfig() {
  const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  const hasKeyId = Boolean(key_id && key_id.trim().length > 0);
  const hasKeySecret = Boolean(key_secret && key_secret.trim().length > 0);

  if (!hasKeyId || !hasKeySecret) {
    const missing = [];
    if (!hasKeyId) missing.push("RAZORPAY_KEY_ID");
    if (!hasKeySecret) missing.push("RAZORPAY_KEY_SECRET");
    return {
      isConfigured: false,
      error: `Razorpay credentials missing from server environment: ${missing.join(", ")}. Please configure them in Render/server environment variables.`,
    };
  }

  return {
    isConfigured: true,
    key_id: key_id.trim(),
    key_secret: key_secret.trim(),
  };
}

function getRazorpayInstance() {
  const config = checkRazorpayConfig();
  if (!config.isConfigured) {
    throw new Error(config.error);
  }
  return new Razorpay({
    key_id: config.key_id,
    key_secret: config.key_secret,
  });
}

// In-memory store for orders and in-flight promise deduplication
const confirmedOrders = [];
const inFlightVerifications = new Map();

// 4. API Routes

// Health Check
app.get(["/api/health", "/health"], (req, res) => {
  const config = checkRazorpayConfig();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xrnofwzaglylwrrxyfyh.supabase.co";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  res.status(200).json({
    status: "HEALTHY",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    server: "UniSwap Node.js/Express Backend",
    services: {
      database: {
        provider: "Supabase PostgreSQL (Cloud)",
        status: supabaseUrl && supabaseKey ? "UP" : "DEGRADED",
        endpoint: "xrnofwzaglylwrrxyfyh.supabase.co",
      },
      paymentGateway: {
        provider: "Razorpay Standard Checkout (Test Mode)",
        status: config.isConfigured ? "READY" : "CONFIG_REQUIRED",
        keyIdConfigured: Boolean(config.key_id),
      },
      aiEngine: {
        provider: "Groq LPU Cloud (Llama 3 70B)",
        status: process.env.GROQ_API_KEY ? "ONLINE" : "OFFLINE",
      },
    },
  });
});

// POST /api/create-order
app.post("/api/create-order", async (req, res) => {
  try {
    const config = checkRazorpayConfig();
    if (!config.isConfigured) {
      console.error("[Razorpay Server Error]:", config.error);
      return res.status(503).json({
        success: false,
        error: config.error,
        isConfigured: false,
      });
    }

    const {
      amount,
      productId,
      productTitle = "Campus Product",
      buyerName = "VIT-AP Student",
      buyerEmail = "student@vitap.ac.in",
      exchangeLocation = "Central Library Ground Desk",
      exchangeTime = "Today at 4:30 PM",
    } = req.body || {};

    let totalAmountPaise = 0;
    let sellerAmountRupees = 0;
    let platformFeeRupees = 0;
    let totalRupees = 0;

    if (typeof amount === "number" && amount > 0) {
      totalAmountPaise = Math.round(amount);
      totalRupees = Math.round(totalAmountPaise / 100);
      sellerAmountRupees = Math.max(1, Math.round(totalRupees / 1.02));
      platformFeeRupees = totalRupees - sellerAmountRupees;
    } else {
      // Default fallback
      sellerAmountRupees = 850;
      platformFeeRupees = 17;
      totalRupees = 867;
      totalAmountPaise = 86700;
    }

    if (totalAmountPaise < 100) {
      return res.status(400).json({
        success: false,
        error: "Order total must be at least ₹1.00 (100 paise).",
      });
    }

    const razorpay = getRazorpayInstance();
    const receiptId = `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmountPaise,
      currency: "INR",
      receipt: receiptId,
      notes: {
        platform: "UniSwap VIT-AP Campus",
        productId: productId || "custom",
        productTitle: (productTitle || "").substring(0, 40),
        buyerEmail,
        buyerName,
        exchangeLocation,
        exchangeTime,
      },
    });

    if (!razorpayOrder || !razorpayOrder.id) {
      return res.status(502).json({
        success: false,
        error: "Failed to create order on Razorpay payment network.",
      });
    }

    // Persist PENDING order in Supabase if accessible
    try {
      const db = getSupabaseClient();
      if (db) {
        await db.from("orders").insert([
          {
            order_id: razorpayOrder.id,
            razorpay_order_id: razorpayOrder.id,
            buyer_name: buyerName,
            buyer_email: buyerEmail,
            seller_amount: sellerAmountRupees,
            platform_fee: platformFeeRupees,
            total_amount: totalRupees,
            status: "PENDING",
            payment_status: "PENDING",
            exchange_location: exchangeLocation,
            exchange_time: exchangeTime,
          },
        ]);
      }
    } catch (dbErr) {
      console.warn("[Express DB Notice]: Supabase pending order sync skipped:", dbErr.message);
    }

    return res.status(200).json({
      success: true,
      order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: config.key_id,
      receipt: razorpayOrder.receipt,
      feeBreakdown: {
        sellerAmount: sellerAmountRupees,
        platformFee: platformFeeRupees,
        totalAmount: totalRupees,
        feePercent: 2,
      },
    });
  } catch (error) {
    console.error("[Express Order Error]:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error while creating payment order.",
    });
  }
});

// POST /api/verify-payment
app.post("/api/verify-payment", async (req, res) => {
  try {
    const config = checkRazorpayConfig();
    if (!config.isConfigured) {
      console.error("[Razorpay Verify Error]:", config.error);
      return res.status(503).json({
        success: false,
        error: config.error,
        isConfigured: false,
      });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderDetails,
    } = req.body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: "Missing required verification parameters (razorpay_order_id, razorpay_payment_id, razorpay_signature).",
      });
    }

    // 1. Idempotency Check: In-memory
    const existingOrder = confirmedOrders.find((o) => o.paymentId === razorpay_payment_id);
    if (existingOrder && existingOrder.paymentStatus === "PAID") {
      console.log(`[Express Flow]: Idempotent match in memory for Payment ${razorpay_payment_id}`);
      return res.status(200).json({
        success: true,
        message: "Payment already verified and captured (idempotent response).",
        order: existingOrder,
      });
    }

    // 2. Idempotency Check: Supabase
    try {
      const db = getSupabaseClient();
      if (db) {
        const { data: dbOrder } = await db
          .from("orders")
          .select("*")
          .eq("payment_id", razorpay_payment_id)
          .maybeSingle();

        if (dbOrder && dbOrder.payment_status === "PAID") {
          const orderFromDb = {
            id: dbOrder.id,
            orderId: dbOrder.order_id,
            razorpayOrderId: dbOrder.razorpay_order_id,
            paymentId: dbOrder.payment_id,
            productId: dbOrder.product_id || orderDetails?.productId || "unknown",
            productTitle: orderDetails?.productTitle || "Campus Purchase",
            sellerId: dbOrder.seller_id || "seller_vitap",
            sellerName: orderDetails?.sellerName || "Verified Student Seller",
            buyerName: dbOrder.buyer_name,
            buyerEmail: dbOrder.buyer_email,
            itemAmount: Number(dbOrder.seller_amount || 0),
            platformFee: Number(dbOrder.platform_fee || 0),
            totalAmount: Number(dbOrder.total_amount || 0),
            status: "PAID",
            paymentStatus: "PAID",
            exchangeLocation: dbOrder.exchange_location,
            exchangeTime: dbOrder.exchange_time,
            createdAt: dbOrder.created_at,
          };
          if (!confirmedOrders.some((o) => o.orderId === orderFromDb.orderId)) {
            confirmedOrders.unshift(orderFromDb);
          }
          return res.status(200).json({
            success: true,
            message: "Payment already verified in database (idempotent response).",
            order: orderFromDb,
          });
        }
      }
    } catch (e) {
      // Non-fatal, continue with verification
    }

    // 3. In-flight Deduplication
    const inFlightKey = `${razorpay_order_id}_${razorpay_payment_id}`;
    if (inFlightVerifications.has(inFlightKey)) {
      console.log(`[Express Flow]: Reusing in-flight verification for ${inFlightKey}`);
      const inFlightResult = await inFlightVerifications.get(inFlightKey);
      return res.status(inFlightResult.status).json(inFlightResult.data);
    }

    const verificationPromise = (async () => {
      // 4. Verify HMAC-SHA256 signature
      const secret = config.key_secret;
      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      let isSignatureValid = false;
      try {
        isSignatureValid = crypto.timingSafeEqual(
          Buffer.from(expectedSignature, "utf-8"),
          Buffer.from(razorpay_signature, "utf-8")
        );
      } catch (err) {
        isSignatureValid = false;
      }

      if (!isSignatureValid) {
        console.warn(`[Express Security Alert]: Invalid signature for order ${razorpay_order_id}`);
        return {
          status: 400,
          data: {
            success: false,
            error: "Invalid payment signature. Verification failed.",
          },
        };
      }

      // 5. Confirm Payment Status directly with Razorpay API (Double-Verification)
      try {
        const razorpay = getRazorpayInstance();
        const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);

        if (paymentDetails.order_id !== razorpay_order_id) {
          return {
            status: 400,
            data: { success: false, error: "Payment order ID mismatch. Transaction rejected." },
          };
        }

        if (paymentDetails.status !== "captured" && paymentDetails.status !== "authorized") {
          return {
            status: 400,
            data: { success: false, error: `Payment is not in captured status (current: ${paymentDetails.status}).` },
          };
        }
      } catch (apiErr) {
        console.warn("[Express Payment Fetch Notice]:", apiErr.message);
      }

      // 6. Build confirmed record
      const confirmedRecord = {
        id: `order_${Date.now()}`,
        orderId: razorpay_order_id,
        razorpayOrderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        productId: orderDetails?.productId || "unknown",
        productTitle: orderDetails?.productTitle || "Campus Purchase",
        productImage: orderDetails?.productImage,
        sellerId: orderDetails?.sellerId || "seller_vitap",
        sellerName: orderDetails?.sellerName || "Verified Student Seller",
        buyerName: orderDetails?.buyerName || "VIT-AP Student",
        buyerEmail: orderDetails?.buyerEmail || "student@vitap.ac.in",
        itemAmount: orderDetails?.itemAmount || 0,
        platformFee: orderDetails?.platformFee || 0,
        totalAmount: orderDetails?.totalAmount || 0,
        status: "PAID",
        paymentStatus: "PAID",
        exchangeLocation: orderDetails?.exchangeLocation || "Central Library Ground Desk",
        exchangeTime: orderDetails?.exchangeTime || "Tomorrow at 4:30 PM",
        createdAt: new Date().toISOString(),
      };

      confirmedOrders.unshift(confirmedRecord);

      // 7. Update Supabase
      try {
        const db = getSupabaseClient();
        if (db) {
          await db
            .from("orders")
            .update({
              status: "PAID",
              payment_status: "PAID",
              payment_id: razorpay_payment_id,
              updated_at: new Date().toISOString(),
            })
            .eq("razorpay_order_id", razorpay_order_id);

          await db.from("transactions").insert([
            {
              order_id: razorpay_order_id,
              razorpay_payment_id: razorpay_payment_id,
              razorpay_order_id: razorpay_order_id,
              razorpay_signature: razorpay_signature,
              amount_paise: Math.round((orderDetails?.totalAmount || 0) * 100),
              currency: "INR",
              status: "CAPTURED",
            },
          ]);
        }
      } catch (dbErr) {
        console.warn("[Express DB Notice]: Supabase update skipped:", dbErr.message);
      }

      return {
        status: 200,
        data: {
          success: true,
          message: "Payment successfully verified and confirmed on campus escrow network.",
          order: confirmedRecord,
        },
      };
    })();

    inFlightVerifications.set(inFlightKey, verificationPromise);

    try {
      const result = await verificationPromise;
      return res.status(result.status).json(result.data);
    } finally {
      inFlightVerifications.delete(inFlightKey);
    }
  } catch (error) {
    console.error("[Express Verify Payment Error]:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error during verification.",
    });
  }
});

// GET /api/verify-payment or GET /api/orders
app.get(["/api/verify-payment", "/api/orders"], async (req, res) => {
  try {
    const db = getSupabaseClient();
    if (db) {
      const { data: dbOrders, error } = await db
        .from("orders")
        .select("*")
        .eq("payment_status", "PAID")
        .order("created_at", { ascending: false });

      if (!error && dbOrders && dbOrders.length > 0) {
        const mappedOrders = dbOrders.map((d) => ({
          id: d.id,
          orderId: d.order_id,
          razorpayOrderId: d.razorpay_order_id,
          paymentId: d.payment_id,
          productId: d.product_id || "unknown",
          productTitle: "Campus Product",
          sellerId: d.seller_id || "seller_vitap",
          sellerName: "Verified Student Seller",
          buyerName: d.buyer_name,
          buyerEmail: d.buyer_email,
          itemAmount: Number(d.seller_amount || 0),
          platformFee: Number(d.platform_fee || 0),
          totalAmount: Number(d.total_amount || 0),
          status: d.status || "PAID",
          paymentStatus: d.payment_status || "PAID",
          exchangeLocation: d.exchange_location || "Central Library Ground Floor",
          exchangeTime: d.exchange_time || "4:30 PM",
          createdAt: d.created_at,
        }));

        const orderMap = new Map();
        mappedOrders.forEach((o) => {
          if (o.orderId) orderMap.set(o.orderId, o);
        });
        confirmedOrders.forEach((o) => {
          if (o.orderId) orderMap.set(o.orderId, o);
        });

        return res.status(200).json({
          success: true,
          orders: Array.from(orderMap.values()),
        });
      }
    }
  } catch (e) {
    // fallback
  }

  return res.status(200).json({
    success: true,
    orders: confirmedOrders,
  });
});

// 5. Strict JSON 404 Handler for ANY unmatched /api route
// Guarantees that API requests NEVER receive an HTML <!DOCTYPE html> page!
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    error: `API endpoint not found: ${req.method} ${req.originalUrl}`,
    status: 404,
  });
});

// Root welcome response
app.get("/", (req, res) => {
  res.status(200).json({
    name: "UniSwap VIT-AP Campus Payment API",
    version: "1.0.0",
    status: "ONLINE",
    healthCheck: "/api/health",
    paymentEndpoints: ["/api/create-order", "/api/verify-payment", "/api/orders"],
  });
});

// 6. Strict JSON Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("[Express API Error Handler]:", err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal server error occurred on payment backend.",
    status: err.status || 500,
  });
});

// 7. Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`  UniSwap Express Payment Server running on port ${PORT}`);
    console.log(`  Health Check: http://localhost:${PORT}/api/health`);
    console.log(`  Create Order: http://localhost:${PORT}/api/create-order`);
    console.log(`  Verify Payment: http://localhost:${PORT}/api/verify-payment`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
