CREATE OR REPLACE FUNCTION compute_trust_scores_batch(p_user_ids UUID[])
RETURNS TABLE (user_id UUID, trust_score NUMERIC)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.id,
    compute_trust_score(u.id)
  FROM unnest(p_user_ids) AS u(id);
END;
$$;

GRANT EXECUTE ON FUNCTION compute_trust_scores_batch(UUID[]) TO anon, authenticated;
