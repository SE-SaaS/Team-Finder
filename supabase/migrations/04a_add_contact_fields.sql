-- Add contact/social fields to profiles table
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS phone        TEXT,
  ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
  ADD COLUMN IF NOT EXISTS github_url   TEXT,
  ADD COLUMN IF NOT EXISTS website_url  TEXT,
  ADD COLUMN IF NOT EXISTS discord_link TEXT;
