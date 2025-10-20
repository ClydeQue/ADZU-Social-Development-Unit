const http = require('http');

// First, we need to login to get a token
const loginData = JSON.stringify({
  email: 'cces@adzu.edu.ph',
  password: 'password123'
});

const loginOptions = {
  hostname: 'localhost',
  port: 5001,
  path: '/api/auth/login/office',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': loginData.length
  }
};

const loginReq = http.request(loginOptions, (loginRes) => {
  let data = '';
  loginRes.on('data', (chunk) => { data += chunk; });
  loginRes.on('end', () => {
    try {
      const response = JSON.parse(data);
      // API returns { success: true, data: { accessToken, user, office } }
      const token = response?.data?.accessToken || response?.accessToken;
      const officeId = response?.data?.user?.office_id || response?.data?.office?.id || response?.office?.id;
      
      if (!token || !officeId) {
        console.log('Login failed:', response);
        return;
      }
      
      console.log('✅ Login successful! Office:', response?.data?.office?.acronym || response?.office?.acronym || response?.data?.user?.office?.acronym);
      
      // Now test the reports endpoint
      const reportsOptions = {
        hostname: 'localhost',
        port: 5001,
        path: `/api/office/${officeId}/reports`,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      const reportsReq = http.request(reportsOptions, (reportsRes) => {
        let reportsData = '';
        reportsRes.on('data', (chunk) => { reportsData += chunk; });
        reportsRes.on('end', () => {
          try {
            const reportsResponse = JSON.parse(reportsData);
            console.log('\n✅ Reports endpoint response:');
            console.log('Office:', reportsResponse.office?.acronym);
            console.log('Programs:', reportsResponse.recent_programs?.length || 0);
            console.log('Activities:', reportsResponse.recent_activities?.length || 0);
            if (reportsResponse.recent_activities?.length > 0) {
              console.log('\nSample activity:');
              const act = reportsResponse.recent_activities[0];
              console.log('  -', act.activity_name);
              console.log('  - Program:', act.programs?.title || 'N/A');
              console.log('  - Status:', act.status);
              console.log('  - Dates:', act.start_date, 'to', act.end_date);
              console.log('  - Participants:', act.participants_count);
              console.log('  - Budget:', act.budget);
              console.log('\n📋 Full activity structure:');
              console.log(JSON.stringify(act, null, 2));
            }
          } catch (e) {
            console.error('Parse error:', e.message);
            console.log('Raw response:', reportsData);
          }
        });
      });
      
      reportsReq.on('error', (error) => {
        console.error('Reports request error:', error);
      });
      
      reportsReq.end();
      
    } catch (e) {
      console.error('Login parse error:', e.message);
      console.log('Raw response:', data);
    }
  });
});

loginReq.on('error', (error) => {
  console.error('Login request error:', error);
});

loginReq.write(loginData);
loginReq.end();
