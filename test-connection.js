const { createClient } = require('@supabase/supabase-js');

// Test Supabase Production
const supabaseUrl = 'https://wobnxsnvmsxsnmxarvcw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvYm54c252bXN4c25teGFydmN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNjc5NDcsImV4cCI6MjA2NTk0Mzk0N30.UiEZNZJjtQeLhEF3vcCWxqrOHNvnnNc9JX_B6g1TLQg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
    console.log('🔍 Testing Supabase connection...');
    
    try {
        // Test basic connection
        const { data, error } = await supabase.from('jobs').select('count').limit(1);
        
        if (error) {
            console.log('❌ Connection failed:', error.message);
        } else {
            console.log('✅ Production connection successful!');
            console.log('📊 Data:', data);
        }
    } catch (err) {
        console.log('❌ Connection error:', err.message);
    }
}

testConnection(); 