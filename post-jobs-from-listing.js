const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'http://localhost:54321';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function postJobsFromListing() {
  try {
    console.log('🚀 Bắt đầu post jobs từ Jobs Listing...');
    
    // Đọc thư mục Jobs Listing
    const jobsListingPath = path.join(__dirname, 'Jobs Listing');
    const files = fs.readdirSync(jobsListingPath);
    
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    console.log(`📁 Tìm thấy ${jsonFiles.length} file job posting`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const file of jsonFiles) {
      try {
        console.log(`\n📄 Đang xử lý file: ${file}`);
        
        // Đọc file JSON
        const filePath = path.join(jobsListingPath, file);
        const jobData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // Chuẩn bị dữ liệu cho database
        const jobToInsert = {
          title: jobData.title,
          company: jobData.company,
          location: jobData.location,
          type: jobData.type.toLowerCase().replace(' ', '-'), // Chuyển "Full-time" -> "full-time"
          work_model: jobData.work_model,
          salary_min: jobData.salary_min,
          salary_max: jobData.salary_max,
          description: jobData.description,
          requirements: jobData.requirements,
          benefits: jobData.benefits,
          is_verified: jobData.verified || false,
          is_active: true,
          level: jobData.level || 'Entry Level'
        };
        
        // Kiểm tra xem job đã tồn tại chưa (dựa trên title và company)
        const { data: existingJobs } = await supabase
          .from('jobs')
          .select('id')
          .eq('title', jobData.title)
          .eq('company', jobData.company)
          .limit(1);
        
        if (existingJobs && existingJobs.length > 0) {
          console.log(`⚠️  Job "${jobData.title}" tại ${jobData.company} đã tồn tại, bỏ qua...`);
          continue;
        }
        
        // Insert job vào database
        const { data, error } = await supabase
          .from('jobs')
          .insert(jobToInsert)
          .select()
          .single();
        
        if (error) {
          console.error(`❌ Lỗi khi post job "${jobData.title}":`, error.message);
          errorCount++;
        } else {
          console.log(`✅ Đã post thành công: ${jobData.title} tại ${jobData.company}`);
          successCount++;
        }
        
        // Delay nhỏ để tránh rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (fileError) {
        console.error(`❌ Lỗi khi xử lý file ${file}:`, fileError.message);
        errorCount++;
      }
    }
    
    console.log('\n📊 Kết quả:');
    console.log(`✅ Thành công: ${successCount} jobs`);
    console.log(`❌ Lỗi: ${errorCount} jobs`);
    console.log(`📁 Tổng cộng: ${jsonFiles.length} files được xử lý`);
    
    if (successCount > 0) {
      console.log('\n🎉 Hoàn thành! Các jobs đã được post lên hệ thống.');
    }
    
  } catch (error) {
    console.error('❌ Lỗi chung:', error.message);
  }
}

// Chạy script
postJobsFromListing(); 