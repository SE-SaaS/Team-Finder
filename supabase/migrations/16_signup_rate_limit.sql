-- ============================================
-- Migration 16: Per-IP rate limit for signups
-- ============================================
-- signup goes through the anon client (no session yet), so the limiter is a
-- SECURITY DEFINER function: the table has RLS on with NO policies (direct
-- anon/authenticated access denied), and only this function can touch it.
-- Policy: max 5 signup attempts per IP per 15-minute rolling window.
-- ============================================

CREATE TABLE IF NOT EXISTS signup_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text NOT NULL,
  attempted_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_signup_attempts_ip_time
  ON signup_attempts (ip_address, attempted_at DESC);

ALTER TABLE signup_attempts ENABLE ROW LEVEL SECURITY;
-- intentionally no policies: only the SECURITY DEFINER function below accesses it

CREATE OR REPLACE FUNCTION public.check_signup_rate_limit(p_ip text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_window_seconds constant int := 900;  -- 15 minutes
  v_max_attempts   constant int := 5;
  v_count int;
BEGIN
  IF p_ip IS NULL OR p_ip = '' THEN
    RETURN true;  -- cannot identify caller; fail open rather than block everyone
  END IF;

  DELETE FROM signup_attempts
   WHERE ip_address = p_ip
     AND attempted_at < now() - make_interval(secs => v_window_seconds);

  SELECT count(*) INTO v_count
    FROM signup_attempts
   WHERE ip_address = p_ip;

  IF v_count >= v_max_attempts THEN
    RETURN false;  -- blocked
  END IF;

  INSERT INTO signup_attempts (ip_address) VALUES (p_ip);
  RETURN true;  -- allowed
END;
$$;

REVOKE ALL ON FUNCTION public.check_signup_rate_limit(text) FROM public;
GRANT EXECUTE ON FUNCTION public.check_signup_rate_limit(text) TO anon, authenticated;
