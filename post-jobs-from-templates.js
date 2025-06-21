const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Supabase configuration (local)
const supabaseUrl = 'http://localhost:54321';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Function to generate a valid UUID
function generateEmployerId() {
  return uuidv4();
}

// Function to post a single job from template
async function postJobFromTemplate(templatePath) {
  try {
    console.log(`📄 Reading template: ${templatePath}`);
    
    // Read and parse template file
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    const jobTemplate = JSON.parse(templateContent);
    
    console.log(`🏢 Creating job: ${jobTemplate.title} at ${jobTemplate.company}`);
    
    // Insert job into database
    const { data, error } = await supabase
      .from('jobs')
      .insert({
        title: jobTemplate.title,
        company: jobTemplate.company,
        location: jobTemplate.location,
        type: jobTemplate.type,
        work_model: jobTemplate.work_model,
        salary_min: jobTemplate.salary_min,
        salary_max: jobTemplate.salary_max,
        description: jobTemplate.description,
        requirements: jobTemplate.requirements,
        benefits: jobTemplate.benefits,
        is_active: true,
        is_verified: Math.random() > 0.4, // 60% chance to be verified
        employer_id: null // Set to null to avoid foreign key constraint
      })
      .select()
      .single();
    
    if (error) {
      console.error('❌ Error creating job:', error);
      throw error;
    }
    
    console.log(`✅ Job created successfully: ${data.id}`);
    return data;
    
  } catch (error) {
    console.error(`❌ Failed to post job from ${templatePath}:`, error.message);
    throw error;
  }
}

// Function to post jobs from multiple templates
async function postJobsFromTemplates(templateDir = './job-templates') {
  try {
    console.log(`🚀 Starting job posting from templates in: ${templateDir}`);
    
    // Check if template directory exists
    if (!fs.existsSync(templateDir)) {
      console.log(`📁 Creating template directory: ${templateDir}`);
      fs.mkdirSync(templateDir, { recursive: true });
      
      // Copy example template to templates directory
      const exampleTemplate = './job-template-example.json';
      if (fs.existsSync(exampleTemplate)) {
        const exampleDest = path.join(templateDir, 'example-frontend-developer.json');
        fs.copyFileSync(exampleTemplate, exampleDest);
        console.log(`📋 Copied example template to: ${exampleDest}`);
      }
    }
    
    // Read all JSON files from template directory
    const templateFiles = fs.readdirSync(templateDir)
      .filter(file => file.endsWith('.json'))
      .map(file => path.join(templateDir, file));
    
    if (templateFiles.length === 0) {
      console.log('⚠️  No template files found. Please add JSON template files to the templates directory.');
      return;
    }
    
    console.log(`📊 Found ${templateFiles.length} template files`);
    
    const results = [];
    let successCount = 0;
    let errorCount = 0;
    
    // Process each template file
    for (const templateFile of templateFiles) {
      try {
        const job = await postJobFromTemplate(templateFile);
        results.push({ success: true, file: templateFile, job: job });
        successCount++;
        
        // Add small delay to avoid overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        results.push({ success: false, file: templateFile, error: error.message });
        errorCount++;
      }
    }
    
    // Summary
    console.log('\n📈 POSTING SUMMARY:');
    console.log(`✅ Successfully posted: ${successCount} jobs`);
    console.log(`❌ Failed to post: ${errorCount} jobs`);
    
    if (errorCount > 0) {
      console.log('\n❌ ERRORS:');
      results.filter(r => !r.success).forEach(r => {
        console.log(`   - ${path.basename(r.file)}: ${r.error}`);
      });
    }
    
    if (successCount > 0) {
      console.log('\n✅ SUCCESSFUL JOBS:');
      results.filter(r => r.success).forEach(r => {
        console.log(`   - ${r.job.title} at ${r.job.company} (ID: ${r.job.id})`);
      });
    }
    
    return results;
    
  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  }
}

// Function to create a sample template
function createSampleTemplate(filename, jobData) {
  const templatePath = `./job-templates/${filename}`;
  
  // Ensure directory exists
  const dir = path.dirname(templatePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Write template file
  fs.writeFileSync(templatePath, JSON.stringify(jobData, null, 2));
  console.log(`📝 Created template: ${templatePath}`);
}

// CLI interface
if (require.main === module) {
  const command = process.argv[2];
  
  if (command === 'post') {
    const templateDir = process.argv[3] || './job-templates';
    postJobsFromTemplates(templateDir);
    
  } else if (command === 'create-sample') {
    // Create a few sample templates
    const samples = [
      {
        filename: 'backend-developer.json',
        data: {
          title: 'Senior Backend Developer',
          company: 'DataCore Systems',
          location: 'Austin, TX',
          type: 'full-time',
          work_model: 'remote',
          salary_min: 2000,
          salary_max: 3000,
          description: '<div class="job-description" style="line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">\\n\\n<div style="margin-bottom: 24px;">\\n<h3 style="margin: 0 0 12px 0; font-size: 1.2rem; color: #1a202c; font-weight: 600;">About the Role</h3>\\n<p style="margin: 0; color: #4a5568; font-size: 0.95rem;">Join our backend team to build scalable, high-performance APIs and microservices that power our platform.</p>\\n</div>\\n\\n</div>',
          requirements: ['5+ years backend development', 'Node.js/Python expertise', 'Database design experience'],
          benefits: ['Health insurance', 'Remote work', '401k matching', 'Learning budget']
        }
      },
      {
        filename: 'product-manager.json',
        data: {
          title: 'Product Manager',
          company: 'InnovateTech',
          location: 'Seattle, WA',
          type: 'full-time',
          work_model: 'hybrid',
          salary_min: 1600,
          salary_max: 2400,
          description: '<div class="job-description" style="line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">\\n\\n<div style="margin-bottom: 24px;">\\n<h3 style="margin: 0 0 12px 0; font-size: 1.2rem; color: #1a202c; font-weight: 600;">About the Role</h3>\\n<p style="margin: 0; color: #4a5568; font-size: 0.95rem;">Lead product strategy and execution for our core platform, working with engineering and design teams.</p>\\n</div>\\n\\n</div>',
          requirements: ['3+ years product management', 'Technical background', 'Agile experience'],
          benefits: ['Competitive salary', 'Stock options', 'Flexible schedule', 'Health benefits']
        }
      }
    ];
    
    samples.forEach(sample => {
      createSampleTemplate(sample.filename, sample.data);
    });
    
    console.log('\\n🎉 Sample templates created! You can now:');
    console.log('1. Edit the templates in ./job-templates/');
    console.log('2. Run: node post-jobs-from-templates.js post');
    
  } else {
    console.log('📋 Job Template Posting Tool');
    console.log('');
    console.log('Usage:');
    console.log('  node post-jobs-from-templates.js post [template-dir]  - Post jobs from templates');
    console.log('  node post-jobs-from-templates.js create-sample       - Create sample templates');
    console.log('');
    console.log('Examples:');
    console.log('  node post-jobs-from-templates.js create-sample');
    console.log('  node post-jobs-from-templates.js post');
    console.log('  node post-jobs-from-templates.js post ./my-templates');
  }
}

module.exports = {
  postJobFromTemplate,
  postJobsFromTemplates,
  createSampleTemplate
}; 