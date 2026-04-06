const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://fsiwgcrnxirgvkmdmvgd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzaXdnY3JueGlyZ3ZrbWRtdmdkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTYyMjk3OSwiZXhwIjoyMDU1MTk4OTc5fQ.NtMEZUMjZQiC3M9Cn8Sz9_bXfMIBvBo-TW14COhQAGY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  console.log('\n🔄 Applying migration: update_courses_skill_names.sql\n');
  
  const migrationPath = path.join(__dirname, 'migrations', 'update_courses_skill_names.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');
  
  // Split by semicolons and execute each statement
  const statements = sql.split(';').filter(s => s.trim() && !s.trim().startsWith('--'));
  
  for (const statement of statements) {
    const trimmed = statement.trim();
    if (!trimmed) continue;
    
    try {
      console.log('Executing:', trimmed.substring(0, 80) + '...');
      const { error } = await supabase.rpc('exec_sql', { sql_query: trimmed });
      if (error) {
        console.error('❌ Error:', error.message);
      } else {
        console.log('✅ Success\n');
      }
    } catch (err) {
      console.error('❌ Exception:', err.message);
    }
  }
  
  console.log('\n✅ Migration complete!\n');
}

applyMigration();
