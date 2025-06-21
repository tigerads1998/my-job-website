const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Kết nối Supabase Cloud
const supabase = createClient(
  'https://wobnxsnvmsxsnmxarvcw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvYm54c252bXN4c25teGFydmN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNjc5NDcsImV4cCI6MjA2NTk0Mzk0N30.UiEZNZJjtQeLhEF3vcCWxqrOHNvnnNc9JX_B6g1TLQg'
);

async function importJobs() {
  try {
    console.log('📋 Bắt đầu import jobs...');
    
    // Đọc file backup
    const jobsData = JSON.parse(fs.readFileSync('jobs-local-backup.json', 'utf8'));
    console.log(`📁 Đọc được ${jobsData.length} jobs từ backup`);
    
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    
    for (const job of jobsData) {
      try {
        // Kiểm tra trùng lặp (theo title và company)
        const { data: existingJobs } = await supabase
          .from('jobs')
          .select('id')
          .eq('title', job.title)
          .eq('company', job.company)
          .limit(1);
        
        if (existingJobs && existingJobs.length > 0) {
          console.log(`⚠️  Job "${job.title}" tại ${job.company} đã tồn tại, bỏ qua...`);
          skipCount++;
          continue;
        }
        
        // Chuẩn bị dữ liệu để insert
        const jobToInsert = {
          title: job.title,
          company: job.company,
          location: job.location,
          type: job.type,
          work_model: job.work_model,
          salary_min: job.salary_min,
          salary_max: job.salary_max,
          description: job.description,
          requirements: job.requirements,
          benefits: job.benefits,
          is_verified: job.is_verified || false,
          is_active: job.is_active !== false, // Mặc định true nếu không có
          employer_id: job.employer_id || null
        };
        
        // Insert job
        const { error } = await supabase
          .from('jobs')
          .insert(jobToInsert);
        
        if (error) {
          console.error(`❌ Lỗi khi insert job "${job.title}":`, error.message);
          errorCount++;
        } else {
          console.log(`✅ Đã import: ${job.title} tại ${job.company}`);
          successCount++;
        }
        
        // Delay nhỏ để tránh rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        console.error(`❌ Lỗi khi xử lý job "${job.title}":`, error.message);
        errorCount++;
      }
    }
    
    console.log('\n📊 Kết quả import jobs:');
    console.log(`✅ Thành công: ${successCount}`);
    console.log(`⚠️  Bỏ qua (trùng): ${skipCount}`);
    console.log(`❌ Lỗi: ${errorCount}`);
    
  } catch (error) {
    console.error('❌ Lỗi khi import jobs:', error.message);
  }
}

async function importApplications() {
  try {
    console.log('\n📋 Bắt đầu import applications...');
    
    // Đọc file backup
    const appsData = JSON.parse(fs.readFileSync('applications-local-backup.json', 'utf8'));
    console.log(`📁 Đọc được ${appsData.length} applications từ backup`);
    
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    
    for (const app of appsData) {
      try {
        // Kiểm tra trùng lặp (theo email và job_id)
        const { data: existingApps } = await supabase
          .from('applications')
          .select('id')
          .eq('email', app.email)
          .eq('job_id', app.job_id)
          .limit(1);
        
        if (existingApps && existingApps.length > 0) {
          console.log(`⚠️  Application của ${app.email} cho job ${app.job_id} đã tồn tại, bỏ qua...`);
          skipCount++;
          continue;
        }
        
        // Chuẩn bị dữ liệu để insert
        const appToInsert = {
          job_id: app.job_id,
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
        
        // Delay nhỏ để tránh rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        console.error(`❌ Lỗi khi xử lý application của ${app.email}:`, error.message);
        errorCount++;
      }
    }
    
    console.log('\n📊 Kết quả import applications:');
    console.log(`✅ Thành công: ${successCount}`);
    console.log(`⚠️  Bỏ qua (trùng): ${skipCount}`);
    console.log(`❌ Lỗi: ${errorCount}`);
    
  } catch (error) {
    console.error('❌ Lỗi khi import applications:', error.message);
  }
}

// Chạy import
(async () => {
  console.log('🚀 Bắt đầu import dữ liệu lên Supabase Cloud...\n');
  
  await importJobs();
  await importApplications();
  
  console.log('\n🎉 Hoàn thành import dữ liệu lên Cloud!');
})(); 