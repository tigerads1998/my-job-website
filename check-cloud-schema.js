const { createClient } = require('@supabase/supabase-js');

// Kết nối Supabase Cloud
const supabase = createClient(
  'https://wobnxsnvmsxsnmxarvcw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvYm54c252bXN4c25teGFydmN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNjc5NDcsImV4cCI6MjA2NTk0Mzk0N30.UiEZNZJjtQeLhEF3vcCWxqrOHNvnnNc9JX_B6g1TLQg'
);

async function checkSchema() {
  try {
    console.log('🔍 Kiểm tra schema bảng jobs trên Cloud...\n');
    
    // Lấy 1 bản ghi để xem cấu trúc
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Lỗi:', error.message);
      return;
    }
    
    if (data && data.length > 0) {
      console.log('📋 Các cột có trong bảng jobs:');
      const columns = Object.keys(data[0]);
      columns.forEach(col => console.log(`  - ${col}`));
      
      console.log('\n📄 Dữ liệu mẫu:');
      console.log(JSON.stringify(data[0], null, 2));
    } else {
      console.log('📋 Bảng jobs trống, kiểm tra schema...');
      
      // Thử insert một bản ghi test để xem lỗi
      const testData = {
        title: 'Test Job',
        company: 'Test Company',
        location: 'Test Location',
        type: 'full-time',
        description: 'Test description',
        is_active: true
      };
      
      const { error: insertError } = await supabase
        .from('jobs')
        .insert(testData);
      
      if (insertError) {
        console.log('❌ Lỗi khi insert test:', insertError.message);
      } else {
        console.log('✅ Insert test thành công');
        // Xóa bản ghi test
        await supabase.from('jobs').delete().eq('title', 'Test Job');
      }
    }
    
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  }
}

checkSchema(); 