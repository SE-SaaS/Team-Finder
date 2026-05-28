-- ============================================
-- Migration 13: Harden handle_new_user — university from verified email only
-- ============================================
-- Migration 07's trigger function had a metadata fallback: when the email
-- domain was unsupported it would still create a profile if
-- raw_user_meta_data.university was set to a valid university name. Supabase's
-- auth endpoint is reachable directly with the public anon key (bypassing
-- /api/auth/signup), so a non-university email could self-assign a real
-- university by passing crafted metadata at signup.
--
-- University must be a pure function of the verified email domain. This
-- replaces the function body so metadata is never consulted: if the email is
-- not @ju.edu.jo or @hu.edu.jo, detected_university is NULL and no profile is
-- created.
--
-- CREATE OR REPLACE updates the function in place; the existing
-- on_auth_user_created trigger already references it, so no trigger change is
-- needed.
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  detected_university TEXT;
BEGIN
  detected_university := CASE
    WHEN NEW.email LIKE '%@ju.edu.jo' THEN 'University of Jordan'
    WHEN NEW.email LIKE '%@hu.edu.jo' THEN 'Hashemite University'
    ELSE NULL
  END;

  IF detected_university IS NULL THEN
    RETURN NEW;
  END IF;

  INSERT INTO public.profiles (id, email, university, name)
  VALUES (
    NEW.id,
    NEW.email,
    detected_university,
    COALESCE(
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'full_name',
      split_part(NEW.email, '@', 1)
    )
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;
