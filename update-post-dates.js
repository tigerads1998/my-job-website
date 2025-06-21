const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'http://localhost:54321';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper function to generate a random date before June 21, 2025
function getRandomPastDate() {
  const end = new Date('2025-06-21T00:00:00Z');
  const start = new Date('2025-06-01T00:00:00Z'); // Start from June 1st for some variety
  
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  
  return randomDate.toISOString();
}

async function updatePostDates() {
  try {
    console.log('🔄 Bắt đầu cập nhật ngày đăng cho tất cả các jobs...');
    
    const { data: jobs, error: fetchError } = await supabase.from('jobs').select('id');
    
    if (fetchError) {
      console.error('❌ Lỗi khi lấy dữ liệu jobs:', fetchError.message);
      return;
    }
    
    console.log(`🔎 Tìm thấy ${jobs.length} jobs để cập nhật.`);
    let updatedCount = 0;
    
    for (const job of jobs) {
      const newDate = getRandomPastDate();
      const { error: updateError } = await supabase
        .from('jobs')
        .update({ created_at: newDate })
        .eq('id', job.id);
        
      if (updateError) {
        console.error(`❌ Lỗi khi cập nhật job ID ${job.id}:`, updateError.message);
      } else {
        updatedCount++;
      }
    }
    
    if (updatedCount > 0) {
      console.log(`\n🎉 Hoàn thành! Đã cập nhật ngày đăng cho ${updatedCount} jobs.`);
      console.log('🗓️ Tất cả các jobs giờ sẽ hiển thị thời gian đăng trước ngày 21/06/2025.');
    } else {
      console.log('\n✨ Không có jobs nào được cập nhật.');
    }
    
  } catch (error) {
    console.error('❌ Lỗi chung:', error.message);
  }
}

updatePostDates(); 