-- ============================================
-- Migration 07: Auto-create profile rows on signup + backfill missing
-- ============================================
-- Previously, profile rows were created by the Next.js auth callback after
-- email confirmation. If that callback failed or never ran (e.g. older test
-- accounts), the auth.users row existed without a matching profile, and
-- every code path that did `.from('profiles')...single()` crashed with
-- PGRST116 "Cannot coerce the result to a single JSON object".
--
-- This migration solves the problem at the database layer with a trigger,
-- and backfills any existing affected users.
-- ============================================

-- 1. Trigger function: derives university from the email domain and inserts a
--    minimal profile row. Skips silently if the email isn't from a supported
--    university so the auth.users INSERT itself still succeeds (the user just
--    won't get a profile until they verify a university email).

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

-- 2. Trigger: fire after each auth.users INSERT

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 3. One-time backfill: create profile rows for existing auth.users with a
--    supported university email but no matching profile.

INSERT INTO public.profiles (id, email, university, name)
SELECT
  u.id,
  u.email,
  CASE
    WHEN u.email LIKE '%@ju.edu.jo' THEN 'University of Jordan'
    WHEN u.email LIKE '%@hu.edu.jo' THEN 'Hashemite University'
    WHEN u.raw_user_meta_data->>'university' IN ('University of Jordan', 'Hashemite University')
      THEN u.raw_user_meta_data->>'university'
  END,
  COALESCE(
    u.raw_user_meta_data->>'name',
    u.raw_user_meta_data->>'full_name',
    split_part(u.email, '@', 1)
  )
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
  AND (
    u.email LIKE '%@ju.edu.jo'
    OR u.email LIKE '%@hu.edu.jo'
    OR u.raw_user_meta_data->>'university' IN ('University of Jordan', 'Hashemite University')
  );
