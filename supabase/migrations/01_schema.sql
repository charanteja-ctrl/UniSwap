-- UniSwap — VIT-AP Edition PostgreSQL Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (VIT-AP Students)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  vit_email TEXT NOT NULL UNIQUE CHECK (vit_email LIKE '%@vitap.ac.in'),
  full_name TEXT NOT NULL,
  registration_number TEXT,
  hostel_block TEXT CHECK (hostel_block IN ('MH-1', 'MH-2', 'MH-3', 'LH-1', 'LH-2', 'Day Scholar', 'Other')),
  phone_number TEXT,
  verified_student BOOLEAN DEFAULT TRUE,
  trust_score NUMERIC(2, 1) DEFAULT 5.0,
  total_sales INTEGER DEFAULT 0,
  total_purchases INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Campus Exchange Locations
CREATE TABLE IF NOT EXISTS public.campus_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

-- Prepopulate campus points
INSERT INTO public.campus_locations (code, name, type, description) VALUES
('LIB-GF', 'Central Library Ground Floor', 'Academic', 'Near the 24/7 self-study check-in desk'),
('FOOD-STREET', 'Food Street / Main Canteen', 'Dining', 'Central outdoor seating area'),
('SAC-FOYER', 'Student Activity Center (SAC)', 'Recreation', 'Near indoor sports lobby'),
('AB1-PLAZA', 'Academic Block 1 (AB-1)', 'Academic', 'Main fountain entrance'),
('AB2-ATRIUM', 'Academic Block 2 (AB-2)', 'Academic', 'Ground floor atrium'),
('MH-1', 'Men''s Hostel 1 (MH-1)', 'Hostel', 'MH-1 Guard desk & reception'),
('MH-2', 'Men''s Hostel 2 (MH-2)', 'Hostel', 'MH-2 Common lounge'),
('MH-3', 'Men''s Hostel 3 (MH-3)', 'Hostel', 'MH-3 Badminton court area'),
('LH-1', 'Ladies Hostel 1 (LH-1)', 'Hostel', 'LH-1 Main entry gate & visitor area'),
('LH-2', 'Ladies Hostel 2 (LH-2)', 'Hostel', 'LH-2 Gate check-in')
ON CONFLICT (code) DO NOTHING;

-- 3. Products / Marketplace Listings
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Books', 'Calculators', 'Electronics', 'Stationery', 'Academic/Lab', 'Bags', 'Hostel Essentials', 'Others', 'Free', 'Swap')),
  price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  condition TEXT NOT NULL CHECK (condition IN ('Like New', 'Good', 'Fair', 'Needs Repair')),
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PENDING_MEETUP', 'SOLD', 'ARCHIVED')),
  is_swap_available BOOLEAN DEFAULT FALSE,
  swap_for TEXT,
  is_free BOOLEAN DEFAULT FALSE,
  demand_rating TEXT DEFAULT 'NORMAL' CHECK (demand_rating IN ('HIGH', 'MEDIUM', 'NORMAL')),
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Orders
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT NOT NULL UNIQUE,
  buyer_id UUID REFERENCES public.profiles(id),
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  seller_id UUID REFERENCES public.profiles(id),
  product_id UUID REFERENCES public.products(id),
  seller_amount NUMERIC(10, 2) NOT NULL,
  platform_fee NUMERIC(10, 2) NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  razorpay_order_id TEXT,
  payment_id TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'SELLER_CONFIRMED', 'EXCHANGE_SCHEDULED', 'COMPLETED', 'CANCELLED')),
  payment_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED')),
  exchange_location TEXT NOT NULL,
  exchange_time TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Transactions / Payment Logs
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT NOT NULL REFERENCES public.orders(order_id),
  razorpay_payment_id TEXT NOT NULL UNIQUE,
  razorpay_order_id TEXT NOT NULL,
  razorpay_signature TEXT NOT NULL,
  amount_paise BIGINT NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'CAPTURED',
  verified_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Products: Everyone can read active products
CREATE POLICY "Public products are viewable by everyone" 
ON public.products FOR SELECT USING (true);

-- Products: Sellers can insert their own products
CREATE POLICY "Users can insert own products" 
ON public.products FOR INSERT WITH CHECK (auth.uid() = seller_id);

-- Products: Sellers can update their own products
CREATE POLICY "Users can update own products" 
ON public.products FOR UPDATE USING (auth.uid() = seller_id);

-- Orders: Users can view orders where they are buyer or seller
CREATE POLICY "Users can view their orders" 
ON public.orders FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
