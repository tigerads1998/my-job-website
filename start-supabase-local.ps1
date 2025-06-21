# PowerShell script to start Supabase local development environment
Write-Host "🚀 Starting Supabase Local Development Environment..." -ForegroundColor Green

# Check if Docker is running
Write-Host "📋 Checking Docker status..." -ForegroundColor Yellow
try {
    docker version | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Check if Supabase CLI is available
Write-Host "📋 Checking Supabase CLI..." -ForegroundColor Yellow
try {
    npx supabase --version | Out-Null
    Write-Host "✅ Supabase CLI is available" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g @supabase/cli
}

# Start Supabase local development
Write-Host "🚀 Starting Supabase services..." -ForegroundColor Green
npx supabase start

Write-Host "✅ Supabase Local Development Environment is ready!" -ForegroundColor Green
Write-Host "📊 Dashboard: http://localhost:54323" -ForegroundColor Cyan
Write-Host "🔗 API URL: http://localhost:54321" -ForegroundColor Cyan
Write-Host "🗄️  Database: postgresql://postgres:postgres@localhost:54322/postgres" -ForegroundColor Cyan
Write-Host "🔑 Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0" -ForegroundColor Cyan 