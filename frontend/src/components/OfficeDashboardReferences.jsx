// Individual Office Dashboard References
// Import this in each office dashboard to show what database fields are available

import DatabaseReferenceClean from './DatabaseReferenceClean';

// Office 1: Social Development Office (SDO)
export const SDODashboardReference = () => {
  return (
    <DatabaseReferenceClean 
      officeId="sdo-office-id" 
      officeName="Social Development Office (SDO)" 
    />
  );
};

// Office 2: Center for Community Extension Services (CCES)
export const CCESDashboardReference = () => {
  return (
    <DatabaseReferenceClean 
      officeId="cces-office-id" 
      officeName="Center for Community Extension Services (CCES)" 
    />
  );
};

// Office 3: Ateneo Peace Institute (API)
export const APIDashboardReference = () => {
  return (
    <DatabaseReferenceClean 
      officeId="api-office-id" 
      officeName="Ateneo Peace Institute (API)" 
    />
  );
};

// Office 4: Social Awareness and Community Service Involvement (SACSI)
export const SACSIDashboardReference = () => {
  return (
    <DatabaseReferenceClean 
      officeId="sacsi-office-id" 
      officeName="Social Awareness and Community Service Involvement (SACSI)" 
    />
  );
};

// Office 5: Ateneo Center for Leadership and Governance (ACLG)
export const ACLGDashboardReference = () => {
  return (
    <DatabaseReferenceClean 
      officeId="aclg-office-id" 
      officeName="Ateneo Center for Leadership and Governance (ACLG)" 
    />
  );
};

// Office 6: Ateneo Center for Culture and the Arts (ACCA)
export const ACCADashboardReference = () => {
  return (
    <DatabaseReferenceClean 
      officeId="acca-office-id" 
      officeName="Ateneo Center for Culture and the Arts (ACCA)" 
    />
  );
};

// Quick Reference List for All Offices (just the essentials)
export const QuickDatabaseReference = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>📝 Quick Database Reference</h1>
      <p><em>What you can work with in any office dashboard:</em></p>

      <div style={{ backgroundColor: '#f0f8ff', padding: '15px', margin: '20px 0', border: '1px solid #87ceeb' }}>
        <h3>Main Tables:</h3>
        <ul>
          <li><strong>programs</strong> - Your office&apos;s programs/projects (CREATE, READ, UPDATE, DELETE)</li>
          <li><strong>office_users</strong> - Your office staff (CREATE, READ, UPDATE, DELETE)</li>
          <li><strong>offices</strong> - Office info (READ only)</li>
        </ul>
      </div>

      <div style={{ backgroundColor: '#f0fff0', padding: '15px', margin: '20px 0', border: '1px solid #90ee90' }}>
        <h3>Key Program Fields:</h3>
        <ul>
          <li><code>title</code> - Program name (required)</li>
          <li><code>description</code> - Program details</li>
          <li><code>status</code> - upcoming | ongoing | completed | cancelled</li>
          <li><code>sustainable_development_goals</code> - Array of UN SDGs (17 options)</li>
          <li><code>adzu_goals</code> - Array of ADZU goals (4 options)</li>
          <li><code>funding_source</code> - Where funding comes from</li>
          <li><code>program_heads</code> - Array of leader names</li>
          <li><code>target_beneficiaries</code> - Target number</li>
          <li><code>actual_beneficiaries</code> - Actual number</li>
          <li><code>proposed_date</code> - When proposed</li>
          <li><code>actual_start_date</code> - When actually started</li>
          <li><code>start_date</code> - Planned start</li>
          <li><code>end_date</code> - When it ends</li>
        </ul>
      </div>

      <div style={{ backgroundColor: '#fff5f5', padding: '15px', margin: '20px 0', border: '1px solid #ffa0a0' }}>
        <h3>Basic Supabase Pattern:</h3>
        <pre style={{ backgroundColor: 'white', padding: '10px' }}>
{`// Read your office programs
const { data } = await supabase
  .from('programs')
  .select('*')
  .eq('office_id', userOfficeId);

// Create new program
const { data } = await supabase
  .from('programs')
  .insert([{
    office_id: userOfficeId,
    title: 'Program Name',
    status: 'upcoming'
  }]);

// Update program
const { data } = await supabase
  .from('programs')
  .update({ status: 'ongoing' })
  .eq('id', programId);`}
        </pre>
      </div>

      <div style={{ backgroundColor: '#fffacd', padding: '15px', margin: '20px 0', border: '1px solid #f0e68c' }}>
        <h3>💡 Developer Tips:</h3>
        <ul>
          <li>Always filter by <code>office_id</code> to get your office&apos;s data only</li>
          <li>SDG and ADZU goals are arrays - you can select multiple</li>
          <li>Use React Query for state management (already set up)</li>
          <li>All IDs are UUIDs, not numbers</li>
          <li>Check the full reference component for complete details</li>
        </ul>
      </div>
    </div>
  );
};
