const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Supabase configuration
const supabaseUrl = 'http://localhost:54321';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateMekanismJob() {
  try {
    console.log('🔄 Bắt đầu cập nhật job Mekanism PPC Specialist...');
    
    // Đọc file JSON đã sửa
    const jobData = JSON.parse(fs.readFileSync('Jobs Listing/Mekanism_PPC_Specialist.json', 'utf8'));
    
    // Xóa job cũ
    const { error: deleteError } = await supabase
      .from('jobs')
      .delete()
      .eq('title', 'Pay-Per-Click Specialist (PPC Specialist)')
      .eq('company', 'Mekanism PPC India');
    
    if (deleteError) {
      console.error('❌ Lỗi khi xóa job cũ:', deleteError.message);
      return;
    }
    
    console.log('✅ Đã xóa job cũ');
    
    // Chuẩn bị dữ liệu cho database
    const jobToInsert = {
      title: jobData.title,
      company: jobData.company,
      location: jobData.location,
      type: jobData.type.toLowerCase().replace(' ', '-'),
      work_model: jobData.work_model,
      salary_min: jobData.salary_min,
      salary_max: jobData.salary_max,
      description: jobData.description,
      requirements: jobData.requirements,
      benefits: jobData.benefits,
      is_verified: jobData.verified || false,
      is_active: true,
      level: jobData.level || 'Mid Level'
    };
    
    // Insert job mới
    const { data, error } = await supabase
      .from('jobs')
      .insert(jobToInsert)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Lỗi khi post job mới:', error.message);
    } else {
      console.log('✅ Đã cập nhật thành công: Pay-Per-Click Specialist tại Mekanism PPC India');
      console.log('📝 Nội dung đã được sửa:');
      console.log('   - Mục "Who You Are" giờ mô tả profile ứng viên lý tưởng');
      console.log('   - Không còn trùng lặp với phần requirements');
      console.log('   - Nội dung phong phú và hấp dẫn hơn');
    }
    
  } catch (error) {
    console.error('❌ Lỗi chung:', error.message);
  }
}

// Chạy script
updateMekanismJob(); 