# PowerShell script to setup database schema for local development
Write-Host "🗄️ Setting up database schema for local development..." -ForegroundColor Green

# Check if Supabase is running
Write-Host "📋 Checking Supabase status..." -ForegroundColor Yellow
try {
    $status = npx supabase status --output json
    Write-Host "✅ Supabase is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase is not running. Starting..." -ForegroundColor Yellow
    npx supabase start
}

# Reset database to apply schema
Write-Host "🔄 Resetting database..." -ForegroundColor Yellow
npx supabase db reset

# Apply migrations
Write-Host "📝 Applying migrations..." -ForegroundColor Yellow
npx supabase db push

Write-Host "✅ Database setup completed!" -ForegroundColor Green
Write-Host "📊 You can now access:" -ForegroundColor Cyan
Write-Host "   - Dashboard: http://localhost:54323" -ForegroundColor Cyan
Write-Host "   - API: http://localhost:54321" -ForegroundColor Cyan
Write-Host "   - Database: postgresql://postgres:postgres@localhost:54322/postgres" -ForegroundColor Cyan 