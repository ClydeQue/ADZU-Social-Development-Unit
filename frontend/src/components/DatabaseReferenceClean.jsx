// Database Reference Guide for Office Dashboards
// Simple reference showing all available database tables, columns, and operations

/* eslint-disable react/prop-types */
const DatabaseReference = ({ officeId = 'office-uuid', officeName = 'Office Name' }) => {
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', backgroundColor: '#f9f9f9' }}>
      <h1>Database Reference Guide</h1>
      <h2>{officeName} Dashboard</h2>
      <p>Office ID: <code>{officeId}</code></p>
      
      <hr style={{ margin: '20px 0' }} />
      
      {/* PROGRAMS TABLE */}
      <section style={{ marginBottom: '40px', backgroundColor: 'white', padding: '20px', border: '1px solid #ddd' }}>
        <h3>📊 PROGRAMS Table</h3>
        <p><strong>Description:</strong> Main table for office programs and projects</p>
        <p><strong>Operations:</strong> CREATE, READ, UPDATE, DELETE</p>
        
        <h4>Columns Available:</h4>
        <ul style={{ lineHeight: '1.8' }}>
          <li><code>id</code> (UUID) - Primary key, auto-generated</li>
          <li><code>office_id</code> (UUID) - References offices table</li>
          <li><code>title</code> (VARCHAR) - Program title (REQUIRED)</li>
          <li><code>description</code> (TEXT) - Program description</li>
          <li><code>status</code> (VARCHAR) - Options: upcoming, ongoing, completed, cancelled</li>
          <li><code>sustainable_development_goals</code> (TEXT[]) - Array of 17 UN SDG options</li>
          <li><code>adzu_goals</code> (TEXT[]) - Array of 4 ADZU institutional goals</li>
          <li><code>funding_source</code> (VARCHAR) - Source of funding</li>
          <li><code>program_heads</code> (TEXT[]) - Array of program leader names</li>
          <li><code>participants_count</code> (INTEGER) - Number of participants</li>
          <li><code>target_beneficiaries</code> (INTEGER) - Target beneficiaries</li>
          <li><code>actual_beneficiaries</code> (INTEGER) - Actual beneficiaries</li>
          <li><code>proposed_date</code> (DATE) - Proposed start date</li>
          <li><code>actual_start_date</code> (DATE) - Actual start date</li>
          <li><code>start_date</code> (DATE) - Planned start date</li>
          <li><code>end_date</code> (DATE) - Program end date</li>
          <li><code>created_by</code> (UUID) - References office_users table</li>
          <li><code>created_at</code> (TIMESTAMP) - Record creation time</li>
          <li><code>updated_at</code> (TIMESTAMP) - Last update time</li>
        </ul>
      </section>

      {/* OFFICE_USERS TABLE */}
      <section style={{ marginBottom: '40px', backgroundColor: 'white', padding: '20px', border: '1px solid #ddd' }}>
        <h3>👥 OFFICE_USERS Table</h3>
        <p><strong>Description:</strong> Office staff and user accounts</p>
        <p><strong>Operations:</strong> CREATE, READ, UPDATE, DELETE</p>
        
        <h4>Columns Available:</h4>
        <ul style={{ lineHeight: '1.8' }}>
          <li><code>id</code> (UUID) - Primary key, auto-generated</li>
          <li><code>office_id</code> (UUID) - References offices table</li>
          <li><code>name</code> (VARCHAR) - User full name (REQUIRED)</li>
          <li><code>email</code> (VARCHAR) - User email (REQUIRED, UNIQUE)</li>
          <li><code>password</code> (VARCHAR) - Hashed password (bcrypt)</li>
          <li><code>created_at</code> (TIMESTAMP) - Account creation time</li>
          <li><code>updated_at</code> (TIMESTAMP) - Last update time</li>
        </ul>
      </section>

      {/* OFFICES TABLE */}
      <section style={{ marginBottom: '40px', backgroundColor: 'white', padding: '20px', border: '1px solid #ddd' }}>
        <h3>🏢 OFFICES Table</h3>
        <p><strong>Description:</strong> Information about the 6 Ateneo offices</p>
        <p><strong>Operations:</strong> READ (mostly read-only reference data)</p>
        
        <h4>Columns Available:</h4>
        <ul style={{ lineHeight: '1.8' }}>
          <li><code>id</code> (UUID) - Primary key, auto-generated</li>
          <li><code>name</code> (VARCHAR) - Office name (REQUIRED, UNIQUE)</li>
          <li><code>description</code> (TEXT) - Office description</li>
          <li><code>created_at</code> (TIMESTAMP) - Record creation time</li>
          <li><code>updated_at</code> (TIMESTAMP) - Last update time</li>
        </ul>
      </section>

      <hr style={{ margin: '40px 0' }} />

      {/* DROPDOWN OPTIONS */}
      <section style={{ marginBottom: '40px', backgroundColor: '#fff3cd', padding: '20px', border: '1px solid #ffeaa7' }}>
        <h3>📋 Dropdown Options Available</h3>
        
        <div style={{ marginBottom: '20px' }}>
          <h4>Program Status Options:</h4>
          <ul>
            <li>upcoming</li>
            <li>ongoing</li>
            <li>completed</li>
            <li>cancelled</li>
          </ul>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h4>Sustainable Development Goals (17 options):</h4>
          <ol>
            <li>No Poverty</li>
            <li>Zero Hunger</li>
            <li>Good Health and Well-being</li>
            <li>Quality Education</li>
            <li>Gender Equality</li>
            <li>Clean Water and Sanitation</li>
            <li>Affordable and Clean Energy</li>
            <li>Decent Work and Economic Growth</li>
            <li>Industry, Innovation and Infrastructure</li>
            <li>Reduced Inequality</li>
            <li>Sustainable Cities and Communities</li>
            <li>Responsible Consumption and Production</li>
            <li>Climate Action</li>
            <li>Life Below Water</li>
            <li>Life on Land</li>
            <li>Peace and Justice Strong Institutions</li>
            <li>Partnerships to achieve the Goal</li>
          </ol>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h4>ADZU Goals (4 options):</h4>
          <ul>
            <li>Academic Excellence</li>
            <li>Community Engagement</li>
            <li>Faith Formation</li>
            <li>Social Justice</li>
          </ul>
        </div>

        <div>
          <h4>Funding Source Options:</h4>
          <ul>
            <li>University Fund</li>
            <li>External Grant</li>
            <li>Government Grant</li>
            <li>Private Donation</li>
            <li>International Grant</li>
            <li>Student Fund</li>
            <li>Alumni Fund</li>
            <li>Corporate Partnership</li>
            <li>Other</li>
          </ul>
        </div>
      </section>

      <hr style={{ margin: '40px 0' }} />

      {/* SQL QUERIES */}
      <section style={{ marginBottom: '40px', backgroundColor: '#e8f5e8', padding: '20px', border: '1px solid #c3e6c3' }}>
        <h3>💻 Common Database Queries</h3>
        
        <div style={{ marginBottom: '20px' }}>
          <h4>Get All Programs for This Office:</h4>
          <pre style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ddd', overflow: 'auto' }}>
{`SELECT * FROM programs 
WHERE office_id = '${officeId}';`}
          </pre>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h4>Get Ongoing Programs:</h4>
          <pre style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ddd', overflow: 'auto' }}>
{`SELECT * FROM programs 
WHERE office_id = '${officeId}' 
  AND status = 'ongoing';`}
          </pre>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h4>Get Office Users:</h4>
          <pre style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ddd', overflow: 'auto' }}>
{`SELECT id, name, email, created_at 
FROM office_users 
WHERE office_id = '${officeId}';`}
          </pre>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h4>Count Programs by Status:</h4>
          <pre style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ddd', overflow: 'auto' }}>
{`SELECT status, COUNT(*) as count 
FROM programs 
WHERE office_id = '${officeId}' 
GROUP BY status;`}
          </pre>
        </div>
      </section>

      <hr style={{ margin: '40px 0' }} />

      {/* SUPABASE EXAMPLES */}
      <section style={{ backgroundColor: '#e3f2fd', padding: '20px', border: '1px solid #90caf9' }}>
        <h3>⚡ Supabase JavaScript Examples</h3>
        
        <div style={{ marginBottom: '20px' }}>
          <h4>1. Read Programs:</h4>
          <pre style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ddd', overflow: 'auto' }}>
{`const { data, error } = await supabase
  .from('programs')
  .select('*')
  .eq('office_id', '${officeId}');`}
          </pre>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h4>2. Create Program:</h4>
          <pre style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ddd', overflow: 'auto' }}>
{`const { data, error } = await supabase
  .from('programs')
  .insert([{
    office_id: '${officeId}',
    title: 'New Program Title',
    status: 'upcoming',
    sustainable_development_goals: ['1. No Poverty', '4. Quality Education'],
    adzu_goals: ['Community Engagement'],
    funding_source: 'University Fund'
  }]);`}
          </pre>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h4>3. Update Program:</h4>
          <pre style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ddd', overflow: 'auto' }}>
{`const { data, error } = await supabase
  .from('programs')
  .update({ 
    status: 'ongoing',
    actual_start_date: '2025-01-15' 
  })
  .eq('id', 'program-uuid-here');`}
          </pre>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h4>4. Delete Program:</h4>
          <pre style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ddd', overflow: 'auto' }}>
{`const { data, error } = await supabase
  .from('programs')
  .delete()
  .eq('id', 'program-uuid-here');`}
          </pre>
        </div>
      </section>

      <hr style={{ margin: '40px 0' }} />

      {/* IMPORTANT NOTES */}
      <section style={{ backgroundColor: '#fff2e1', padding: '20px', border: '1px solid #ffb74d' }}>
        <h3>⚠️ Important Development Notes</h3>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>UUIDs:</strong> All primary keys are UUIDs, not auto-incrementing integers</li>
          <li><strong>Security:</strong> Passwords are bcrypt hashed with 12 salt rounds</li>
          <li><strong>Arrays:</strong> TEXT[] columns can store multiple string values</li>
          <li><strong>Filtering:</strong> Always filter by office_id to get office-specific data</li>
          <li><strong>Authentication:</strong> Use Supabase Auth for user sessions</li>
          <li><strong>RLS:</strong> Row Level Security is enabled on all tables</li>
          <li><strong>SDG Tracking:</strong> Use sustainable_development_goals for UN SDG alignment</li>
          <li><strong>ADZU Goals:</strong> Use adzu_goals for institutional goal tracking</li>
          <li><strong>Multiple Heads:</strong> program_heads array supports multiple leaders</li>
          <li><strong>Date Tracking:</strong> Separate proposed_date, actual_start_date, start_date, end_date</li>
        </ul>
      </section>

      <hr style={{ margin: '40px 0' }} />

      {/* THE 6 OFFICES */}
      <section style={{ backgroundColor: '#f3e5f5', padding: '20px', border: '1px solid #ce93d8' }}>
        <h3>🏢 The 6 Ateneo Offices</h3>
        <ol style={{ lineHeight: '1.8' }}>
          <li><strong>SDO</strong> - Social Development Office</li>
          <li><strong>CCES</strong> - Center for Community Extension Services</li>
          <li><strong>API</strong> - Ateneo Peace Institute</li>
          <li><strong>SACSI</strong> - Social Awareness and Community Service Involvement</li>
          <li><strong>ACLG</strong> - Ateneo Center for Leadership and Governance</li>
          <li><strong>ACCA</strong> - Ateneo Center for Culture and the Arts</li>
        </ol>
        <p><em>Each office has its own dashboard but shares the same database structure.</em></p>
      </section>
    </div>
  );
};

export default DatabaseReference;
