const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://wobnxsnvmsxsnmxarvcw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvYm54c252bXN4c25teGFydmN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNjc5NDcsImV4cCI6MjA2NTk0Mzk0N30.UiEZNZJjtQeLhEF3vcCWxqrOHNvnnNc9JX_B6g1TLQg'
);

async function checkDatabaseData() {
  console.log('🔍 Kiểm tra dữ liệu trong database...\n');
  
  try {
    // Kiểm tra bảng jobs
    console.log('📋 Kiểm tra bảng jobs:');
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('*');
    
    if (jobsError) {
      console.log(`❌ Lỗi: ${jobsError.message}`);
    } else {
      console.log(`✅ Tìm thấy ${jobs.length} jobs`);
      if (jobs.length > 0) {
        console.log('   - Jobs đầu tiên:', jobs[0].title);
        console.log('   - Jobs cuối cùng:', jobs[jobs.length - 1].title);
      }
    }
    
    console.log('\n📋 Kiểm tra bảng applications:');
    const { data: applications, error: appsError } = await supabase
      .from('applications')
      .select('*');
    
    if (appsError) {
      console.log(`❌ Lỗi: ${appsError.message}`);
    } else {
      console.log(`✅ Tìm thấy ${applications.length} applications`);
      if (applications.length > 0) {
        console.log('   - Application đầu tiên:', applications[0].name);
      }
    }
    
  } catch (error) {
    console.log('❌ Lỗi kết nối:', error.message);
  }
}

checkDatabaseData(); 