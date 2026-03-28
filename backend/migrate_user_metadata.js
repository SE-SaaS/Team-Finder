/**
 * Migration Script: Update User Metadata with University
 *
 * This script updates all existing users' metadata to include the 'university' field
 * extracted from their email domain. This fixes the authorization issue where users
 * get "Unverified university email" error when completing their profile.
 *
 * Usage:
 *   node backend/migrate_user_metadata.js
 *
 * Requirements:
 *   - NEXT_PUBLIC_SUPABASE_URL in .env
 *   - SUPABASE_SERVICE_ROLE_KEY in .env (Admin access)
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { createClient } = require('@supabase/supabase-js');

// Supabase Admin Client (requires service role key)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nPlease add these to your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

/**
 * Extract university code from email domain
 * @param {string} email - User's email address
 * @returns {string} - 'JU', 'HU', or null
 */
function getUniversityFromEmail(email) {
  if (!email) return null;

  if (email.endsWith('@ju.edu.jo')) return 'JU';
  if (email.endsWith('@hu.edu.jo')) return 'HU';

  return null;
}

/**
 * Main migration function
 */
async function migrateUserMetadata() {
  console.log('🚀 Starting user metadata migration...\n');

  try {
    // Fetch all users (requires admin access)
    console.log('📥 Fetching all users from Supabase Auth...');
    const { data: { users }, error: fetchError } = await supabase.auth.admin.listUsers();

    if (fetchError) {
      throw new Error(`Failed to fetch users: ${fetchError.message}`);
    }

    console.log(`✓ Found ${users.length} users\n`);

    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    // Process each user
    for (const user of users) {
      const email = user.email;
      const currentMetadata = user.user_metadata || {};

      // Skip if university is already set
      if (currentMetadata.university) {
        console.log(`⏭️  Skipping ${email} - university already set (${currentMetadata.university})`);
        skippedCount++;
        continue;
      }

      // Extract university from email
      const university = getUniversityFromEmail(email);

      if (!university) {
        console.log(`⚠️  Skipping ${email} - not a university email`);
        skippedCount++;
        continue;
      }

      // Update user metadata
      console.log(`🔄 Updating ${email} - setting university to ${university}`);

      const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
        user_metadata: {
          ...currentMetadata,
          university,
          verification_method: 'email_domain',
        }
      });

      if (updateError) {
        console.error(`❌ Failed to update ${email}: ${updateError.message}`);
        errorCount++;
      } else {
        console.log(`✓ Successfully updated ${email}`);
        updatedCount++;
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 Migration Summary:');
    console.log('='.repeat(60));
    console.log(`Total users: ${users.length}`);
    console.log(`✓ Updated: ${updatedCount}`);
    console.log(`⏭️  Skipped: ${skippedCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log('='.repeat(60));

    if (errorCount > 0) {
      console.log('\n⚠️  Migration completed with errors. Please review the error messages above.');
      process.exit(1);
    } else {
      console.log('\n✅ Migration completed successfully!');
      console.log('All users can now complete their profiles without authorization errors.\n');
      process.exit(0);
    }

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Run migration
migrateUserMetadata();
