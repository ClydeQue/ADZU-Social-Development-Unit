const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkOffices() {
  console.log('\n=== CHECKING OFFICES ===\n');
  
  // Get all offices
  const { data: offices, error: officesError } = await supabase
    .from('offices')
    .select('id, name, acronym')
    .order('acronym');
  
  console.log('All Offices:');
  console.log(offices);
  
  // Get all active office credentials
  const { data: credentials, error: credError } = await supabase
    .from('office_credentials')
    .select('id, name, office_id, user_type, is_active')
    .eq('user_type', 'office_user')
    .eq('is_active', true);
  
  console.log('\nActive Office Credentials:');
  console.log(credentials);
  
  // Map them together
  console.log('\nMapped Offices with Credentials:');
  offices.forEach(office => {
    const cred = credentials.find(c => c.office_id === office.id);
    console.log(`${office.acronym} (${office.name}): ${cred ? 'HAS CREDENTIAL (id: ' + cred.id + ')' : 'NO CREDENTIAL'}`);
  });
}

checkOffices().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
