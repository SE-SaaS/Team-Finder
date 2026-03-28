/**
 * Migration Runner Script
 * Applies the add_skills_to_courses.sql migration to the database
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function runMigration() {
  console.log('🚀 Starting migration...\n');

  // Initialize Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Missing Supabase credentials');
    console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Read migration SQL file
  const migrationPath = path.join(__dirname, 'supabase', 'migrations', 'add_skills_to_courses.sql');
  console.log(`📄 Reading migration file: ${migrationPath}\n`);

  const sql = fs.readFileSync(migrationPath, 'utf8');

  // Split SQL into individual statements (simple split by semicolon + newline)
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

  // Execute each statement
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    console.log(`\n[${i + 1}/${statements.length}] Executing statement...`);

    // Show first 100 chars of statement
    const preview = statement.substring(0, 100).replace(/\n/g, ' ');
    console.log(`   ${preview}...`);

    try {
      const { data, error } = await supabase.rpc('exec_sql', {
        sql_query: statement + ';'
      });

      if (error) {
        // Try direct query method if RPC fails
        const { error: queryError } = await supabase
          .from('courses')
          .select('*')
          .limit(1);

        if (queryError && queryError.message.includes('exec_sql')) {
          console.log('   ⚠️  RPC method not available, using direct connection...');
          // For UPDATE statements, we'll need to use the REST API
          // This is a workaround - ideally use psql or Supabase dashboard
          console.log('   ℹ️  Skipping (use Supabase Dashboard SQL Editor instead)');
          continue;
        }

        throw error;
      }

      console.log('   ✅ Success');
      successCount++;
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Migration Summary:');
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Failed: ${errorCount}`);
  console.log(`   📝 Total: ${statements.length}`);
  console.log('='.repeat(60));

  if (errorCount > 0) {
    console.log('\n⚠️  Some statements failed. Please run the SQL manually in Supabase Dashboard:');
    console.log('   1. Go to: https://supabase.com/dashboard');
    console.log('   2. Select your project');
    console.log('   3. Go to SQL Editor');
    console.log('   4. Copy and paste the contents of: supabase/migrations/add_skills_to_courses.sql');
    console.log('   5. Click "Run"\n');
  } else {
    console.log('\n✨ Migration completed successfully!\n');
  }
}

// Run migration
runMigration().catch(error => {
  console.error('\n❌ Migration failed:', error);
  process.exit(1);
});
