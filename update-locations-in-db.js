const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'http://localhost:54321';
const supabaseServiceKey = 'eyJhbGciOiJIxzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const locationMap = {
  'Austin, TX': 'United States',
  'Boston, MA': 'United States',
  'Chicago, IL': 'United States',
  'Los Angeles, CA': 'United States',
  'Miami, FL': 'United States',
  'New York, NY': 'United States',
  'Seattle, WA': 'United States',
  'Lisbon, Portugal': 'Portugal',
};

function normalizeCountry(location) {
  if (!location) return null;

  if (locationMap[location]) {
    return locationMap[location];
  }
  
  const countries = ['Australia', 'Brazil', 'Canada', 'France', 'Germany', 'India', 'Japan', 'Mexico', 'Netherlands', 'Philippines', 'Singapore', 'South Africa', 'South Korea', 'Spain', 'United Kingdom', 'United States', 'Portugal'];
  if (countries.includes(location)) {
      return location;
  }
  
  if (location.includes(',')) {
    const parts = location.split(',');
    const potentialCountry = parts[parts.length - 1].trim();
    if (countries.includes(potentialCountry)) {
        return potentialCountry;
    }
  }

  const usIdentifiers = [', CA', ', IL', ', MA', ', FL', ', NY', ', TX', ', WA'];
  for (const identifier of usIdentifiers) {
      if (location.endsWith(identifier)) {
          return 'United States';
      }
  }

  return location;
}

async function updateLocationsInDb() {
  try {
    console.log('🔄 Bắt đầu cập nhật location trong database...');
    
    // Fetch all jobs
    const { data: jobs, error: fetchError } = await supabase.from('jobs').select('id, location');
    
    if (fetchError) {
      console.error('❌ Lỗi khi lấy dữ liệu jobs:', fetchError.message);
      return;
    }
    
    console.log(`🔎 Tìm thấy ${jobs.length} jobs trong database để kiểm tra.`);
    let updatedCount = 0;
    
    for (const job of jobs) {
      const originalLocation = job.location;
      const normalizedLocation = normalizeCountry(originalLocation);
      
      if (originalLocation !== normalizedLocation) {
        const { error: updateError } = await supabase
          .from('jobs')
          .update({ location: normalizedLocation })
          .eq('id', job.id);
          
        if (updateError) {
          console.error(`❌ Lỗi khi cập nhật job ID ${job.id}:`, updateError.message);
        } else {
          console.log(`✅ Cập nhật job ID: ${job.id} | Location: "${originalLocation}" -> "${normalizedLocation}"`);
          updatedCount++;
        }
      }
    }
    
    if (updatedCount > 0) {
      console.log(`\n🎉 Hoàn thành! Đã cập nhật ${updatedCount} jobs trong database.`);
    } else {
      console.log('\n✨ Dữ liệu location trong database đã chuẩn.');
    }
    
  } catch (error) {
    console.error('❌ Lỗi chung:', error.message);
  }
}

updateLocationsInDb(); 