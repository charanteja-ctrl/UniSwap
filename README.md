# UniSwap — VIT-AP Edition 🎓

> **A trusted peer-to-peer marketplace built exclusively for VIT-AP University students to buy, sell, and swap campus essentials safely and affordably.**

---

## 🏗️ Tech Stack & Architecture

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti.
- **Payment Gateway**: **Razorpay Standard Web Checkout** (`/v1/checkout.js`) with backend order creation (`POST /api/create-order`) and HMAC-SHA256 signature verification (`POST /api/verify-payment`).
- **AI Intelligence**: **Groq Cloud** (`llama-3.3-70b-versatile`) for AI listing assistant, dynamic pricing & campus demand analysis, and campus chatbot.
- **Database & Auth**: **Supabase** PostgreSQL with Row Level Security (RLS) policies and VIT-AP student verification constraints (`@vitap.ac.in`).

```
┌─────────────────────────────────────────────────────────┐
│                    VIT-AP STUDENT                       │
│             Browser / Mobile Web Application            │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   NEXT.JS (VERCEL)                      │
│  - Browse Marketplace (/), Search, Filter by Hostel    │
│  - Product Detail & Pre-Checkout Breakdown Modal        │
│  - Razorpay Standard Web Checkout Integration           │
│  - Sell & Swap (/sell) with Groq AI Assistance          │
│  - My Orders (/orders) & Admin Revenue (/admin)         │
└────────────┬─────────────────────────────┬──────────────┘
             │                             │
             ▼                             ▼
┌───────────────────────────┐ ┌───────────────────────────┐
│     RAZORPAY GATEWAY      │ │         GROQ AI           │
│  - Orders API             │ │  - Listing Generator     │
│  - HMAC-SHA256 Verify     │ │  - Price Suggester        │
│  - 2% Escrow Split        │ │  - Campus Support Chat    │
└───────────────────────────┘ └───────────────────────────┘
```

---

## 🚀 Key Features

1. **Razorpay Standard Web Checkout**:
   - Backend order creation endpoint validates amount (minimum 100 paise).
   - Client modal loads `https://checkout.razorpay.com/v1/checkout.js`.
   - On payment success, sends `razorpay_payment_id`, `razorpay_order_id`, and `razorpay_signature` to backend.
   - Backend performs constant-time comparison of computed HMAC-SHA256 signature vs. gateway signature.
   - Handles dismiss (`modal.ondismiss`) and failure (`payment.failed`) states.
2. **Transparent 2% Platform Fee**:
   - Dynamic breakdown calculation (e.g. ₹1,000 item price + ₹20 platform fee = ₹1,020 total payable).
   - Configurable in settings.
3. **Campus Exchange Points**:
   - Predefined safe meetup points across VIT-AP:
     - 📍 Central Library Ground Floor (24/7 Desk)
     - 📍 Food Street / Main Canteen Plaza
     - 📍 Student Activity Center (SAC)
     - 📍 Academic Block 1 (AB-1) & Block 2 (AB-2)
     - 📍 Hostels: MH-1, MH-2, MH-3, LH-1, LH-2
4. **Groq AI Integration**:
   - **Listing Assistant**: Turns informal student descriptions into structured, polished marketplace listings.
   - **Price Suggester & Demand Meter**: Recommends fair resale prices and shows campus demand level (`HIGH`, `MEDIUM`, `NORMAL`).
   - **Ask UniSwap AI**: In-app chatbot answering campus logistics, exchange spots, and fee questions.
5. **Verified Student Guard**:
   - Restricted to `@vitap.ac.in` university accounts.
6. **Swap & Free Items**:
   - Dedicated support for book-for-book swaps and free donations to juniors.

---

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js (v18 or v20+)
- npm

### 2. Environment Setup
Create a `.env.local` file in the root directory (based on `.env.example`):

```env
# Razorpay Credentials (Test Mode)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id

# Groq AI Credentials
GROQ_API_KEY=your_groq_api_key

# Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL=https://your_project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Platform Settings
PLATFORM_FEE_PERCENT=2
UNIVERSITY_DOMAIN=vitap.ac.in
```

> **Security Reminder**: `RAZORPAY_KEY_SECRET`, `GROQ_API_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are strictly server-side variables and are never exposed to client-side code. `.env*` is ignored in `.gitignore`.

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 💳 How to Test Razorpay Standard Checkout

1. Navigate to the marketplace homepage [http://localhost:3000](http://localhost:3000).
2. Click **"Buy Now"** on any item (e.g. *Casio FX-991CW Calculator* or *Higher Engineering Mathematics*).
3. The checkout confirmation modal will display:
   - Item price & transparent 2% UniSwap fee breakdown
   - Campus exchange point picker (e.g. Central Library, MH-2)
   - Preferred meetup time slot
4. Click **"Pay via Razorpay"**:
   - The official Razorpay checkout modal opens in test mode.
   - Use test cards or test UPI provided in Razorpay documentation (e.g., standard success test card `4111 1111 1111 1111`, any future expiry, CVV `123`).
5. On successful authorization:
   - Razorpay callback sends `razorpay_payment_id`, `razorpay_order_id`, and `razorpay_signature` to `/api/verify-payment`.
   - Backend validates the HMAC-SHA256 signature using `RAZORPAY_KEY_SECRET`.
   - On validation, confetti fires and the verified order receipt with campus meetup coordinates appears.
6. Visit [/orders](http://localhost:3000/orders) to inspect your verified order history and [/admin](http://localhost:3000/admin) to view real-time platform revenue and GMV.

---

## 📂 Project Structure

```
UniSwap/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── create-order/route.ts      # Razorpay order generation
│   │   │   ├── verify-payment/route.ts    # HMAC-SHA256 signature verifier
│   │   │   └── ai/
│   │   │       ├── generate-listing/      # Groq AI listing generator
│   │   │       ├── price-suggest/         # Groq AI price analysis
│   │   │       └── chat/                  # Groq AI campus chatbot
│   │   ├── admin/page.tsx                 # Admin & revenue dashboard
│   │   ├── orders/page.tsx                # Orders & verified receipts
│   │   ├── sell/page.tsx                  # Sell & swap listing creator
│   │   ├── layout.tsx                     # Root layout & footer
│   │   ├── page.tsx                       # Marketplace feed & filters
│   │   └── globals.css                    # Tailwind directives
│   ├── components/
│   │   ├── Navbar.tsx                     # Campus navbar & verified badge
│   │   ├── RazorpayCheckoutButton.tsx     # Razorpay standard checkout modal
│   │   └── AIAssistantModal.tsx           # Floating Groq AI campus helper
│   └── lib/
│       ├── constants.ts                   # VIT-AP locations & mock listings
│       ├── groq.ts                        # Groq SDK configuration
│       ├── razorpay.ts                    # Razorpay SDK & crypto verifier
│       ├── supabase.ts                    # Supabase client & service role
│       └── types.ts                       # TypeScript interfaces
├── supabase/
│   └── migrations/
│       └── 01_schema.sql                  # PostgreSQL tables & RLS policies
├── .env.example                           # Example environment template
├── .gitignore                             # Secret & dependency protection
├── package.json                           # Dependencies & scripts
└── tsconfig.json                          # TypeScript configuration
```

---

## 📜 License
MIT License. Built for the VIT-AP University student community.
