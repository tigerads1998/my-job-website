const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Supabase configuration
const supabaseUrl = 'http://localhost:54321';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateBothJobs() {
  try {
    console.log('🔄 Bắt đầu cập nhật cả 2 job postings...');
    
    // Cập nhật Together Group SEO/SEM Specialist
    console.log('\n📝 Cập nhật Together Group SEO/SEM Specialist...');
    
    // Xóa job cũ
    const { error: deleteError1 } = await supabase
      .from('jobs')
      .delete()
      .eq('title', 'SEO/SEM Specialist')
      .eq('company', 'Together Group');
    
    if (deleteError1) {
      console.error('❌ Lỗi khi xóa job Together Group cũ:', deleteError1.message);
    } else {
      console.log('✅ Đã xóa job Together Group cũ');
    }
    
    // Đọc và post job mới
    const togetherGroupData = JSON.parse(fs.readFileSync('Jobs Listing/TogetherGroup_SEO_SEM_Specialist.json', 'utf8'));
    
    const togetherGroupJob = {
      title: togetherGroupData.title,
      company: togetherGroupData.company,
      location: togetherGroupData.location,
      type: togetherGroupData.type.toLowerCase().replace(' ', '-'),
      work_model: togetherGroupData.work_model,
      salary_min: togetherGroupData.salary_min,
      salary_max: togetherGroupData.salary_max,
      description: togetherGroupData.description,
      is_verified: togetherGroupData.verified || false,
      is_active: true,
      level: togetherGroupData.level || 'Mid Level'
    };
    
    const { error: insertError1 } = await supabase
      .from('jobs')
      .insert(togetherGroupJob)
      .select()
      .single();
    
    if (insertError1) {
      console.error('❌ Lỗi khi post job Together Group mới:', insertError1.message);
    } else {
      console.log('✅ Đã cập nhật thành công: SEO/SEM Specialist tại Together Group');
    }
    
    // Cập nhật Mekanism PPC Specialist
    console.log('\n📝 Cập nhật Mekanism PPC Specialist...');
    
    // Xóa job cũ
    const { error: deleteError2 } = await supabase
      .from('jobs')
      .delete()
      .eq('title', 'Pay-Per-Click Specialist (PPC Specialist)')
      .eq('company', 'Mekanism PPC India');
    
    if (deleteError2) {
      console.error('❌ Lỗi khi xóa job Mekanism cũ:', deleteError2.message);
    } else {
      console.log('✅ Đã xóa job Mekanism cũ');
    }
    
    // Đọc và post job mới
    const mekanismData = JSON.parse(fs.readFileSync('Jobs Listing/Mekanism_PPC_Specialist.json', 'utf8'));
    
    const mekanismJob = {
      title: mekanismData.title,
      company: mekanismData.company,
      location: mekanismData.location,
      type: mekanismData.type.toLowerCase().replace(' ', '-'),
      work_model: mekanismData.work_model,
      salary_min: mekanismData.salary_min,
      salary_max: mekanismData.salary_max,
      description: mekanismData.description,
      is_verified: mekanismData.verified || false,
      is_active: true,
      level: mekanismData.level || 'Mid Level'
    };
    
    const { error: insertError2 } = await supabase
      .from('jobs')
      .insert(mekanismJob)
      .select()
      .single();
    
    if (insertError2) {
      console.error('❌ Lỗi khi post job Mekanism mới:', insertError2.message);
    } else {
      console.log('✅ Đã cập nhật thành công: Pay-Per-Click Specialist tại Mekanism PPC India');
    }
    
    console.log('\n🎉 Hoàn thành cập nhật cả 2 job postings!');
    console.log('📝 Những thay đổi đã thực hiện:');
    console.log('   - Bỏ phần requirements và benefits ở cuối file JSON');
    console.log('   - Giữ lại nội dung đẹp trong phần description');
    console.log('   - Cấu trúc file gọn gàng và chuyên nghiệp hơn');
    
  } catch (error) {
    console.error('❌ Lỗi chung:', error.message);
  }
}

// Chạy script
updateBothJobs(); 