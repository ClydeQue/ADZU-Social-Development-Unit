/**
 * Update Strategic Goals Wording Migration Script
 * Run this to update the strategic goals in the database to match the exact ADZU wording
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateStrategicGoals() {
  console.log('Starting strategic goals update...\n');

  try {
    // Update Goal 1
    const { error: error1 } = await supabase
      .from('adzu_strategic_goals')
      .update({
        title: 'Advancing Ignatian Spirituality',
        description: 'Promoting and deepening Ignatian spiritual values and practices'
      })
      .eq('goal_number', 1);

    if (error1) throw error1;
    console.log('✓ Goal 1 updated');

    // Update Goal 2
    const { error: error2 } = await supabase
      .from('adzu_strategic_goals')
      .update({
        title: 'United in purpose and action',
        description: 'Fostering collaboration, unity, and collective action towards shared goals'
      })
      .eq('goal_number', 2);

    if (error2) throw error2;
    console.log('✓ Goal 2 updated');

    // Update Goal 3
    const { error: error3 } = await supabase
      .from('adzu_strategic_goals')
      .update({
        title: 'Dedicated to holistic growth and human flourishing',
        description: 'Supporting comprehensive development of individuals - intellectually, emotionally, spiritually, and physically'
      })
      .eq('goal_number', 3);

    if (error3) throw error3;
    console.log('✓ Goal 3 updated');

    // Update Goal 4
    const { error: error4 } = await supabase
      .from('adzu_strategic_goals')
      .update({
        title: 'Zealous in charting global paths',
        description: 'Pursuing excellence and innovation in global engagement and outreach'
      })
      .eq('goal_number', 4);

    if (error4) throw error4;
    console.log('✓ Goal 4 updated');

    // Verify the updates
    const { data, error } = await supabase
      .from('adzu_strategic_goals')
      .select('*')
      .order('goal_number');

    if (error) throw error;

    console.log('\n✓ All strategic goals updated successfully!\n');
    console.log('Current strategic goals in database:');
    console.table(data);

  } catch (error) {
    console.error('✗ Error updating strategic goals:', error);
    process.exit(1);
  }
}

updateStrategicGoals();
