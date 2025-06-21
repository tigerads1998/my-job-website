const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

async function checkJobs() {
  console.log('🔍 Kiểm tra các job bị mất...\n');
  
  const jobIds = [
    '3cc65ef7-573e-4ea1-862c-0993260edcd8',
    '08ae7bfd-83f5-46d4-864a-b25be70aeccb'
  ];
  
  for (const jobId of jobIds) {
    console.log(`📋 Kiểm tra job ID: ${jobId}`);
    
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();
      
      if (error) {
        console.log(`❌ Lỗi: ${error.message}`);
      } else if (data) {
        console.log(`✅ Tìm thấy job: "${data.title}" tại ${data.company}`);
        console.log(`   - Trạng thái: ${data.is_active ? 'Active' : 'Inactive'}`);
        console.log(`   - Ngày tạo: ${data.created_at}`);
      } else {
        console.log(`❌ Không tìm thấy job với ID này`);
      }
    } catch (err) {
      console.log(`❌ Lỗi khi truy vấn: ${err.message}`);
    }
    
    console.log('');
  }
  
  // Kiểm tra tổng số jobs
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('id, title, company, is_active')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.log(`❌ Lỗi khi đếm jobs: ${error.message}`);
    } else {
      console.log(`📊 Tổng số jobs trong database: ${data.length}`);
      console.log(`📊 Jobs active: ${data.filter(job => job.is_active).length}`);
      console.log(`📊 Jobs inactive: ${data.filter(job => !job.is_active).length}`);
    }
  } catch (err) {
    console.log(`❌ Lỗi khi đếm jobs: ${err.message}`);
  }
}

checkJobs(); 