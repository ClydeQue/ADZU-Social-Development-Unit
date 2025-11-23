// Run SQL migration to create password_reset_requests table
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  try {
    console.log('📦 Reading migration file...');
    const sqlFile = path.join(__dirname, 'create_password_reset_requests.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    console.log('🚀 Running migration...');
    
    // Split SQL into individual statements and execute them
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const statement of statements) {
      console.log('Executing statement...');
      const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
      
      if (error) {
        console.error('❌ Migration error:', error);
        console.log('\n⚠️  Please run this SQL manually in Supabase SQL Editor:');
        console.log('\n' + sql);
        process.exit(1);
      }
    }

    console.log('✅ Migration completed successfully!');
    console.log('✅ password_reset_requests table created');
    
  } catch (error) {
    console.error('❌ Error running migration:', error);
    console.log('\n⚠️  Please run this SQL manually in Supabase SQL Editor:');
    console.log('\n📋 Copy the contents of: backend/migrations/create_password_reset_requests.sql');
    console.log('\nOr go to: https://supabase.com/dashboard/project/YOUR_PROJECT/editor');
    process.exit(1);
  }
}

runMigration();
