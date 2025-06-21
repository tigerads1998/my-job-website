const { createClient } = require('@supabase/supabase-js');

// Sử dụng client thường như frontend
const supabase = createClient(
  'http://localhost:54321',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
);

async function checkVerifiedJobs() {
    console.log('🔍 Checking verified jobs...');
    
    try {
        // Lấy tất cả jobs như frontend sẽ làm
        const { data: jobs, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.log('❌ Error:', error.message);
            return;
        }

        console.log('📊 Total jobs found:', jobs.length);
        
        jobs.forEach(job => {
            console.log(`\n📝 Job: ${job.title}`);
            console.log(`   Company: ${job.company}`);
            console.log(`   Location: ${job.location}`);
            console.log(`   ✅ Is Verified: ${job.is_verified}`);
            console.log(`   ID: ${job.id}`);
        });

        // Kiểm tra cụ thể job "Hiring"
        const hiringJob = jobs.find(job => job.title === 'Hiring');
        if (hiringJob) {
            console.log('\n🎯 Found "Hiring" job:');
            console.log('   Verified status:', hiringJob.is_verified);
            console.log('   Should show verified icon:', hiringJob.is_verified ? 'YES' : 'NO');
        } else {
            console.log('\n❌ "Hiring" job not found in active jobs');
        }

    } catch (err) {
        console.log('❌ Error:', err.message);
    }
}

checkVerifiedJobs(); 