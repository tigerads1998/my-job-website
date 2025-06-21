const { createClient } = require('@supabase/supabase-js');

// Sử dụng production database với service_role key
const adminSupabase = createClient(
  'https://wobnxsnvmsxsnmxarvcw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvYm54c252bXN4c25teGFydmN3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDM2Nzk0NywiZXhwIjoyMDY1OTQzOTQ3fQ.M2GO1HdEmCqY-izi8MpLtmtLOcMK-FdNKu1JHct0YoA'
);

async function createProductionVerifiedJob() {
    console.log('🔍 Creating verified job in production...');
    
    try {
        // Tạo job mới với is_verified = true trong production
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

        console.log('✅ Verified job created in production successfully!');
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

createProductionVerifiedJob(); 