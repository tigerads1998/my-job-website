const path = require('path');
// require('dotenv').config(); // Temporarily disabled for hardcoding
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// --- Configuration ---
const JOBS_LISTING_DIR = path.join(__dirname, 'Jobs Listing');

// --- Database Connection ---
// Use the service_role key to bypass RLS for admin tasks like this.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // <-- Using SERVICE_KEY now

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function postAllJobsFromDirectory() {
  console.log(`Reading job files from: ${JOBS_LISTING_DIR}`);

  let files;
  try {
    files = fs.readdirSync(JOBS_LISTING_DIR).filter(f => f.endsWith('.json'));
  } catch (error) {
    console.error(`❌ Could not read directory: ${JOBS_LISTING_DIR}`, error);
    return;
  }

  if (files.length === 0) {
    console.log('🟡 No JSON job files found in the directory. Nothing to post.');
    return;
  }

  console.log(`Found ${files.length} job files to process.`);

  for (const file of files) {
    const filePath = path.join(JOBS_LISTING_DIR, file);
    console.log(`\n--- Processing: ${file} ---`);

    let jobData;
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      jobData = JSON.parse(fileContent);
    } catch (error) {
      console.error(`❌ Failed to read or parse ${file}. Skipping.`, error);
      continue; // Skip to the next file
    }

    // Map JSON to the database schema, ensuring all required fields are present
    const jobToInsert = {
      // id: jobData.id, // DO NOT insert the ID from the file. Let Supabase generate it.
      title: jobData.title,
      company: jobData.company,
      location: jobData.location,
      type: jobData.type.toLowerCase(),
      level: jobData.level || 'not-specified', // Add default if missing
      work_model: jobData.work_model,
      salary_min: jobData.salary_min,
      salary_max: jobData.salary_max,
      description: jobData.description,
      requirements: jobData.requirements,
      benefits: jobData.benefits,
      is_verified: jobData.verified || false,
      is_active: true,
    };
    
    // Check if the job already exists by title and company to avoid duplicates
    const { data: existing } = await supabase
      .from('jobs')
      .select('id')
      .eq('title', jobToInsert.title)
      .eq('company', jobToInsert.company)
      .single();

    if (existing) {
      console.log(`🟡 Job "${jobToInsert.title}" at "${jobToInsert.company}" already exists. Skipping.`);
      continue;
    }

    // Insert the new job
    const { error } = await supabase.from('jobs').insert([jobToInsert]);

    if (error) {
      console.error(`❌ Error inserting job "${jobToInsert.title}":`, error.message);
    } else {
      console.log(`✅ Successfully inserted job: "${jobToInsert.title}"`);
    }
  }
  console.log('\n--- All files processed. ---');
}

postAllJobsFromDirectory(); 