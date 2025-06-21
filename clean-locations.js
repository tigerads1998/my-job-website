const fs = require('fs');
const path = require('path');

const jobsListingPath = path.join(__dirname, 'Jobs Listing');

// From the user-provided image
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
  // Direct mapping for known city/state combinations
  if (locationMap[location]) {
    return locationMap[location];
  }
  
  // If it's already a country name from the list, it's fine.
  const countries = ['Australia', 'Brazil', 'Canada', 'France', 'Germany', 'India', 'Japan', 'Mexico', 'Netherlands', 'Philippines', 'Singapore', 'South Africa', 'South Korea', 'Spain', 'United Kingdom', 'United States', 'Portugal'];
  if (countries.includes(location)) {
      return location;
  }
  
  // Handle cases like "City, Country" -> "Country"
  if (location.includes(',')) {
    const parts = location.split(',');
    const potentialCountry = parts[parts.length - 1].trim();
    if (countries.includes(potentialCountry)) {
        return potentialCountry;
    }
  }

  // Fallback for other potential US locations not in the map
  const usIdentifiers = [', CA', ', IL', ', MA', ', FL', ', NY', ', TX', ', WA'];
  for (const identifier of usIdentifiers) {
      if (location.endsWith(identifier)) {
          return 'United States';
      }
  }

  return location; // Return original if no mapping found
}

async function cleanLocations() {
  try {
    console.log('🧹 Bắt đầu chuẩn hóa location trong tất cả các file...');
    
    const files = fs.readdirSync(jobsListingPath);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    console.log(`🔎 Tìm thấy ${jsonFiles.length} file JSON để kiểm tra.`);
    let updatedCount = 0;
    
    for (const file of jsonFiles) {
      const filePath = path.join(jobsListingPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      let jobData;
      try {
        jobData = JSON.parse(fileContent);
      } catch (jsonError) {
        console.error(`❌ Lỗi khi phân tích JSON trong file ${file}:`, jsonError.message);
        continue; // Skip this file
      }

      const originalLocation = jobData.location;
      
      if (originalLocation) {
        const normalizedLocation = normalizeCountry(originalLocation);
        
        if (originalLocation !== normalizedLocation) {
          jobData.location = normalizedLocation;
          fs.writeFileSync(filePath, JSON.stringify(jobData, null, 2));
          console.log(`✅ Cập nhật file: ${file} | Location: "${originalLocation}" -> "${normalizedLocation}"`);
          updatedCount++;
        }
      }
    }
    
    if (updatedCount > 0) {
      console.log(`\n🎉 Hoàn thành! Đã cập nhật ${updatedCount} file JSON.`);
    } else {
      console.log('\n✨ Dữ liệu location trong các file JSON đã chuẩn.');
    }
    
  } catch (error) {
    console.error('❌ Lỗi chung:', error.message);
  }
}

// Run script
cleanLocations(); 