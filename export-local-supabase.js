const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Kết nối Supabase Local
const supabase = createClient(
  'http://localhost:54321',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
);

async function exportTable(table) {
  const { data, error } = await supabase.from(table).select('*');
  if (error) {
    console.error(`❌ Lỗi khi lấy dữ liệu bảng ${table}:`, error.message);
    return null;
  }
  fs.writeFileSync(`${table}-local-backup.json`, JSON.stringify(data, null, 2));
  console.log(`✅ Đã xuất ${data.length} bản ghi từ bảng ${table} ra file ${table}-local-backup.json`);
  return data;
}

async function exportApplicationsWithJobInfo() {
  // Lấy tất cả applications
  const { data: apps, error: appsError } = await supabase.from('applications').select('*');
  if (appsError) {
    console.error('❌ Lỗi khi lấy applications:', appsError.message);
    return;
  }
  // Lấy tất cả jobs để map
  const { data: jobs, error: jobsError } = await supabase.from('jobs').select('id, title, company');
  if (jobsError) {
    console.error('❌ Lỗi khi lấy jobs:', jobsError.message);
    return;
  }
  // Map thêm job_title và company cho từng application
  const enriched = apps.map(app => {
    const job = jobs.find(j => j.id === app.job_id);
    return {
      ...app,
      job_title: job ? job.title : '',
      company: job ? job.company : ''
    };
  });
  fs.writeFileSync('applications-local-backup.json', JSON.stringify(enriched, null, 2));
  console.log(`✅ Đã xuất ${enriched.length} applications (có job_title, company) ra file applications-local-backup.json`);
}

(async () => {
  await exportTable('jobs');
  await exportApplicationsWithJobInfo();
  console.log('🎉 Đã backup xong dữ liệu local (có job_title, company)!');
})(); 