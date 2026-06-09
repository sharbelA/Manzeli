-- ──────────────────────────────────────────────────────────────
-- Run this in the Supabase SQL editor (project dashboard → SQL).
-- ──────────────────────────────────────────────────────────────

-- 1. Add 'guest' to the role enum (skips silently if the type doesn't exist)
DO $$
BEGIN
  ALTER TYPE public.role ADD VALUE IF NOT EXISTS 'guest';
EXCEPTION
  WHEN undefined_object THEN NULL; -- role column is text, not enum — skip
END;
$$;

-- 2. Update handle_new_user so public self-signups default to 'guest'.
--    Admin/host accounts created via the admin panel pass role in
--    user_metadata, so they keep their correct role.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', SPLIT_PART(NEW.email, '@', 1)),
    CASE
      WHEN NEW.raw_user_meta_data ->> 'role' IN ('admin', 'host')
      THEN NEW.raw_user_meta_data ->> 'role'
      ELSE 'guest'
    END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- 3. Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid        NOT NULL REFERENCES public.listings  ON DELETE CASCADE,
  guest_id   uuid        NOT NULL REFERENCES auth.users       ON DELETE CASCADE,
  guest_name text        NOT NULL,
  rating     int         NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment    text        NOT NULL DEFAULT '',
  status     text        NOT NULL DEFAULT 'pending'
                         CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_listing_status
  ON public.reviews (listing_id, status);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 4. RLS policies

-- Public: see approved reviews; guests see their own pending/rejected; admin sees all
CREATE POLICY "reviews_select"
  ON public.reviews FOR SELECT
  USING (
    status = 'approved'
    OR guest_id = auth.uid()
    OR public.get_my_role() = 'admin'
  );

-- Authenticated users may insert their own review
CREATE POLICY "reviews_insert"
  ON public.reviews FOR INSERT
  WITH CHECK (
    guest_id = auth.uid()
    AND auth.uid() IS NOT NULL
  );

-- Only admins may update (status moderation)
CREATE POLICY "reviews_update_admin"
  ON public.reviews FOR UPDATE
  USING (public.get_my_role() = 'admin');

-- Only admins may delete
CREATE POLICY "reviews_delete_admin"
  ON public.reviews FOR DELETE
  USING (public.get_my_role() = 'admin');
