const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Kết nối Supabase Cloud
const supabase = createClient(
  'https://wobnxsnvmsxsnmxarvcw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvYm54c252bXN4c25teGFydmN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNjc5NDcsImV4cCI6MjA2NTk0Mzk0N30.UiEZNZJjtQeLhEF3vcCWxqrOHNvnnNc9JX_B6g1TLQg'
);

async function main() {
  // 1. Lấy toàn bộ jobs trên cloud
  const { data: jobs, error: jobsError } = await supabase.from('jobs').select('id, title, company');
  if (jobsError) {
    console.error('❌ Lỗi khi lấy jobs trên cloud:', jobsError.message);
    return;
  }
  // Tạo map: {title+company: id}
  const jobMap = {};
  jobs.forEach(job => {
    jobMap[`${job.title}__${job.company}`] = job.id;
  });

  // 2. Đọc file applications local
  const appsData = JSON.parse(fs.readFileSync('applications-local-backup.json', 'utf8'));
  console.log(`📁 Đọc được ${appsData.length} applications từ backup`);

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const app of appsData) {
    // Tìm job_id mới
    const key = `${app.job_title || ''}__${app.company || ''}`;
    let newJobId = null;
    // Nếu file local không có job_title/company, thử lấy từ job_id cũ (nếu trùng id)
    if (app.job_title && app.company) {
      newJobId = jobMap[key];
    } else {
      // fallback: thử map theo id cũ (rất hiếm khi trùng)
      newJobId = jobs.find(j => j.id === app.job_id)?.id;
    }
    if (!newJobId) {
      // Thử map theo tất cả jobs có cùng job_id cũ (nếu có)
      const found = jobs.find(j => j.id === app.job_id);
      if (found) newJobId = found.id;
    }
    if (!newJobId) {
      console.warn(`⚠️  Không tìm thấy job cho application của ${app.email}, bỏ qua.`);
      skipCount++;
      continue;
    }

    // Kiểm tra trùng lặp (theo email và job_id mới)
    const { data: existingApps } = await supabase
      .from('applications')
      .select('id')
      .eq('email', app.email)
      .eq('job_id', newJobId)
      .limit(1);
    if (existingApps && existingApps.length > 0) {
      console.log(`⚠️  Application của ${app.email} cho job_id ${newJobId} đã tồn tại, bỏ qua...`);
      skipCount++;
      continue;
    }

    // Chuẩn bị dữ liệu để insert
    const appToInsert = {
      job_id: newJobId,
      name: app.name,
      email: app.email,
      cover_letter: app.cover_letter || '',
      linkedin_profile: app.linkedin_profile,
      resume_url: app.resume_url,
      user_id: app.user_id || null,
      status: app.status || 'pending'
    };
    // Insert application
    const { error } = await supabase
      .from('applications')
      .insert(appToInsert);
    if (error) {
      console.error(`❌ Lỗi khi insert application của ${app.email}:`, error.message);
      errorCount++;
    } else {
      console.log(`✅ Đã import application của ${app.email}`);
      successCount++;
    }
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log('\n📊 Kết quả import applications:');
  console.log(`✅ Thành công: ${successCount}`);
  console.log(`⚠️  Bỏ qua: ${skipCount}`);
  console.log(`❌ Lỗi: ${errorCount}`);
}

main(); 