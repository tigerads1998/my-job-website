require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// --- IMPORTANT ---
// This script connects to your LOCAL Supabase instance.
// It uses the credentials from your .env file.
// Make sure your .env file has the correct SUPABASE_URL and SUPABASE_KEY for your local setup.
// These are typically found in your Supabase project's settings.

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_KEY must be set in your .env file.');
  console.error('Please create a .env file based on env.example and add your Supabase credentials.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const JOB_TEMPLATE_PATH = path.join(__dirname, 'perfect-job-template.json');

async function postJob() {
  console.log('Reading job template from:', JOB_TEMPLATE_PATH);

  let jobData;
  try {
    const templateContent = fs.readFileSync(JOB_TEMPLATE_PATH, 'utf-8');
    jobData = JSON.parse(templateContent);
  } catch (error) {
    console.error(`❌ Failed to read or parse the job template at ${JOB_TEMPLATE_PATH}.`, error);
    return;
  }

  // Check if a job with this ID already exists to prevent duplicates
  const { data: existingJob, error: selectError } = await supabase
    .from('jobs')
    .select('id')
    .eq('id', jobData.id)
    .single();

  if (selectError && selectError.code !== 'PGRST116') { // PGRST116 = "exact one row not found"
    console.error('Error checking for existing job:', selectError.message);
    return;
  }

  if (existingJob) {
    console.log(`🟡 Job with ID "${jobData.id}" already exists in the database. Skipping.`);
    return;
  }

  // Map the JSON data to the database schema
  const jobToInsert = {
      id: jobData.id,
      title: jobData.title,
      company: jobData.company,
      location: jobData.location,
      type: jobData.type,
      level: jobData.level,
      work_model: jobData.work_model,
      salary_min: jobData.salary_min,
      salary_max: jobData.salary_max,
      description: jobData.description,
      requirements: jobData.requirements,
      benefits: jobData.benefits,
      is_verified: jobData.verified,
      // employer_id and is_active can be set to defaults or handled as needed
      is_active: true,
      // You might need to provide a valid employer_id from your 'employers' table
      // employer_id: 'some-default-employer-id' 
  };
  
  console.log(`\nAttempting to insert job: "${jobToInsert.title}"...`);

  const { data, error } = await supabase
    .from('jobs')
    .insert([jobToInsert]);

  if (error) {
    console.error('❌ Error inserting job into the database:');
    console.error(error);
  } else {
    console.log('✅ Successfully inserted job:');
    console.log(data);
  }
}

postJob(); 