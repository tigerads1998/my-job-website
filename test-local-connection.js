const { createClient } = require('@supabase/supabase-js');

// Test Supabase Local
const supabaseUrl = 'http://localhost:54321';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLocalConnection() {
    console.log('🔍 Testing Supabase Local connection...');
    
    try {
        // Test basic connection
        const { data, error } = await supabase.from('jobs').select('count').limit(1);
        
        if (error) {
            console.log('❌ Local connection failed:', error.message);
            console.log('💡 Make sure Supabase local is running: npx supabase start');
        } else {
            console.log('✅ Local connection successful!');
            console.log('📊 Data:', data);
        }
    } catch (err) {
        console.log('❌ Local connection error:', err.message);
        console.log('💡 Make sure Supabase local is running: npx supabase start');
    }
}

testLocalConnection(); 