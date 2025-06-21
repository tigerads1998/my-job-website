const { createClient } = require('@supabase/supabase-js');

// Sử dụng admin client để có thể insert và update
const adminSupabase = createClient(
  'http://localhost:54321',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
);

async function createVerifiedJob() {
    console.log('🔍 Creating verified job...');
    
    try {
        // Tạo job mới với is_verified = true
        const { data: job, error: jobError } = await adminSupabase
            .from('jobs')
            .insert({
                title: 'Hiring',
                company: 'Onlinejobs',
                location: 'India',
                type: 'part-time',
                work_model: 'remote',
                is_verified: true,
                salary_min: 1000,
                salary_max: 5000,
                description: 'Hello world',
                requirements: [],
                benefits: [],
                is_active: true
            })
            .select()
            .single();

        if (jobError) {
            console.log('❌ Error creating job:', jobError.message);
            return;
        }

        console.log('✅ Verified job created successfully!');
        console.log('📊 Job data:', job);

        // Kiểm tra lại job đã tạo
        const { data: checkJob, error: checkError } = await adminSupabase
            .from('jobs')
            .select('*')
            .eq('id', job.id)
            .single();

        if (checkError) {
            console.log('❌ Error checking job:', checkError.message);
        } else {
            console.log('🔍 Job verification status:', checkJob.is_verified);
        }

    } catch (err) {
        console.log('❌ Error:', err.message);
    }
}

createVerifiedJob(); 