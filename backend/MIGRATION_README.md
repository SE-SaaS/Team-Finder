# User Metadata Migration Guide

## Problem
Users get "Unverified university email" error when completing their profile because the `user.user_metadata.university` field is missing.

## Solution
This migration script updates all existing users' metadata to include their university (JU or HU) extracted from their email domain.

---

## Prerequisites

You need to add your Supabase keys to the `.env` file in the root directory:

### Step 1: Get Your Supabase Keys

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/fsiwgcrnxirgvkmdmvgd
2. Click on **Settings** (⚙️ icon in the sidebar)
3. Click on **API** in the settings menu
4. Copy the following keys:
   - **anon / public key** → Use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → Use for `SUPABASE_SERVICE_ROLE_KEY`

### Step 2: Update `.env` File

Open `d:\ChaosX\Team-Finder\.env` and replace the placeholders:

```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key-here
```

**⚠️ IMPORTANT:** The service_role key has admin privileges. Never commit it to git or share it publicly!

---

## Running the Migration

Once you've updated the `.env` file with your actual keys:

```bash
cd d:\ChaosX\Team-Finder\backend
npm run migrate:users
```

Or run directly:

```bash
cd d:\ChaosX\Team-Finder\backend
node migrate_user_metadata.js
```

---

## What the Script Does

1. ✅ Connects to Supabase using admin credentials
2. ✅ Fetches all users from Supabase Auth
3. ✅ For each user:
   - Checks if `user_metadata.university` already exists (skips if yes)
   - Extracts university from email domain (@ju.edu.jo → JU, @hu.edu.jo → HU)
   - Updates user metadata with university and verification_method
4. ✅ Provides a summary of updated/skipped users

---

## Expected Output

```
🚀 Starting user metadata migration...

📥 Fetching all users from Supabase Auth...
✓ Found 5 users

🔄 Updating student1@ju.edu.jo - setting university to JU
✓ Successfully updated student1@ju.edu.jo

🔄 Updating student2@hu.edu.jo - setting university to HU
✓ Successfully updated student2@hu.edu.jo

⏭️  Skipping admin@example.com - not a university email

============================================================
📊 Migration Summary:
============================================================
Total users: 5
✓ Updated: 4
⏭️  Skipped: 1
❌ Errors: 0
============================================================

✅ Migration completed successfully!
All users can now complete their profiles without authorization errors.
```

---

## After Migration

Once the migration completes successfully:
- ✅ All university users will have the `university` field in their metadata
- ✅ Profile completion will work without "Unverified university email" errors
- ✅ New signups automatically get the university field (no migration needed)

---

## Troubleshooting

### Error: "Missing required environment variables"
- Make sure `.env` file exists in the root directory
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set

### Error: "Failed to fetch users"
- Check that your `SUPABASE_SERVICE_ROLE_KEY` is correct
- Verify you copied the **service_role** key, not the anon key

### Error: "Failed to update [email]"
- Check the console output for specific error messages
- Verify the user exists in Supabase Auth
