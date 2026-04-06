/**
 * Migration Display Tool
 * Usage: node apply-migration.js <migration-file-name>
 * Example: node apply-migration.js update_project_filtering.sql
 */

const fs = require('fs');
const path = require('path');

function displayMigration() {
  const migrationFile = process.argv[2] || 'update_project_filtering.sql';

  console.log('🗂️  Migration Display Tool\n');

  // Read migration SQL file
  const migrationPath = path.join(__dirname, 'migrations', migrationFile);

  if (!fs.existsSync(migrationPath)) {
    console.error(`❌ Error: Migration file not found: ${migrationPath}`);
    console.log(`\nAvailable migrations:`);
    const migrationsDir = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql'));
    files.forEach(f => console.log(`   - ${f}`));
    process.exit(1);
  }

  console.log(`📄 Migration File: ${migrationFile}\n`);
  const sql = fs.readFileSync(migrationPath, 'utf8');

  // Display SQL
  console.log('📋 SQL TO EXECUTE:\n');
  console.log('='.repeat(80));
  console.log(sql);
  console.log('='.repeat(80));

  // Instructions
  console.log('\n📝 HOW TO APPLY THIS MIGRATION:\n');
  console.log('1. Go to: https://supabase.com/dashboard');
  console.log('2. Select your project');
  console.log('3. Click "SQL Editor" in left sidebar');
  console.log('4. Copy the SQL content above (between the === lines)');
  console.log('5. Paste into SQL Editor');
  console.log('6. Click "Run" (or press Ctrl+Enter)\n');
  console.log('✅ Done! The migration will apply all changes to your database.\n');
}

try {
  displayMigration();
} catch (error) {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
}
