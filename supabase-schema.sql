-- ============================================================
-- THREADLINE — SUPABASE SQL SETUP SCRIPT
-- Run this entire file in Supabase → SQL Editor → New query
-- ============================================================


-- ──────────────────────────────────────────────────────────────
-- 1. PROFILES TABLE
-- Extends the built-in auth.users table with role + display info
-- ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT,
  full_name   TEXT,
  role        TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create a profile row whenever a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    'user'
  );
  RETURN NEW;
END;
$$;

-- Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ──────────────────────────────────────────────────────────────
-- 2. PRODUCTS TABLE
-- ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT NOT NULL,
  price       NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  category    TEXT NOT NULL,
  color       TEXT,
  image       TEXT,
  stock       INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  sizes       TEXT[] DEFAULT '{}',
  rating      NUMERIC(3, 1) DEFAULT 4.5 CHECK (rating >= 0 AND rating <= 5),
  is_new      BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at on row changes
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS products_updated_at ON public.products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


-- ──────────────────────────────────────────────────────────────
-- 3. ROW LEVEL SECURITY (RLS)
-- ──────────────────────────────────────────────────────────────

-- Enable RLS on both tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;


-- ── Profiles policies ──────────────────────────────────────────

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Admins can read all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );


-- ── Products policies ──────────────────────────────────────────

-- ANYONE (including anonymous) can read products
CREATE POLICY "Anyone can view products"
  ON public.products FOR SELECT
  USING (TRUE);

-- Only admins can insert products
CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can update products
CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can delete products
CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );


-- ──────────────────────────────────────────────────────────────
-- 4. SEED PRODUCTS (optional — delete if you want to start empty)
-- ──────────────────────────────────────────────────────────────

INSERT INTO public.products (name, description, price, category, color, image, stock, sizes, rating, is_new)
VALUES
  (
    'Waxed Field Jacket',
    'A waxed-cotton field jacket with a brushed flannel lining, built for slow mornings and long walks.',
    248.00, 'Outerwear', 'Olive',
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
    12, ARRAY['S','M','L','XL'], 4.8, TRUE
  ),
  (
    'Merino Crewneck Sweater',
    'Fine-gauge merino wool, knitted in a small mill for a soft, breathable layer.',
    128.00, 'Knitwear', 'Oat',
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
    20, ARRAY['XS','S','M','L'], 4.6, FALSE
  ),
  (
    'Organic Cotton Tee',
    'A heavyweight organic cotton tee with a relaxed drape and reinforced collar.',
    38.00, 'Tops', 'Bone',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    50, ARRAY['XS','S','M','L','XL'], 4.4, FALSE
  ),
  (
    'Wide-Leg Linen Trousers',
    'Lightweight linen trousers with a wide leg and pressed pleat, finished with horn buttons.',
    142.00, 'Bottoms', 'Clay',
    'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80',
    15, ARRAY['S','M','L'], 4.5, TRUE
  ),
  (
    'Slip Midi Dress',
    'A bias-cut silk-blend slip dress that falls just below the knee.',
    168.00, 'Dresses', 'Terracotta',
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
    8, ARRAY['XS','S','M','L'], 4.7, FALSE
  ),
  (
    'Canvas Tote',
    'Heavy 16oz canvas tote with leather handles and reinforced base.',
    58.00, 'Accessories', 'Natural',
    'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&q=80',
    30, ARRAY['One Size'], 4.3, FALSE
  ),
  (
    'Shearling Collar Coat',
    'A wool-blend coat with a removable shearling collar and double-breasted front.',
    412.00, 'Outerwear', 'Camel',
    'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=800&q=80',
    6, ARRAY['S','M','L','XL'], 4.9, TRUE
  ),
  (
    'Ribbed Turtleneck',
    'A fine-ribbed turtleneck in a wool-cotton blend, cut close to the body.',
    96.00, 'Knitwear', 'Charcoal',
    'https://images.unsplash.com/photo-1614975059251-992f11792b9f?w=800&q=80',
    25, ARRAY['XS','S','M','L','XL'], 4.5, FALSE
  ),
  (
    'Selvedge Denim Jeans',
    'Straight-leg jeans cut from Japanese selvedge denim, garment-washed once.',
    188.00, 'Bottoms', 'Indigo',
    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
    18, ARRAY['S','M','L','XL'], 4.7, FALSE
  ),
  (
    'Linen Wrap Dress',
    'A relaxed wrap dress in washed linen with a self-tie belt and side pockets.',
    154.00, 'Dresses', 'Sage',
    'https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=800&q=80',
    10, ARRAY['XS','S','M','L'], 4.6, TRUE
  );
