# Supabase Local Development Setup

Hướng dẫn thiết lập và sử dụng Supabase local development environment cho dự án website tuyển dụng.

## Yêu cầu hệ thống

- Docker Desktop
- Node.js (v16+)
- PowerShell (Windows)

## Cài đặt và khởi động

### 1. Khởi động Docker Desktop
Đảm bảo Docker Desktop đang chạy trên máy của bạn.

### 2. Chạy script khởi động
```powershell
.\start-supabase-local.ps1
```

Hoặc chạy thủ công:
```powershell
npx supabase start
```

### 3. Kiểm tra trạng thái
```powershell
npx supabase status
```

## Thông tin kết nối

Sau khi khởi động thành công, bạn sẽ có:

- **Dashboard**: http://localhost:54323
- **API URL**: http://localhost:54321
- **Database**: postgresql://postgres:postgres@localhost:54322/postgres
- **Anon Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0

## Sử dụng trong code

### Chuyển đổi giữa Production và Local

Trong file `src/supabase.ts`, thay đổi import:

```typescript
// Sử dụng Supabase production
import { supabase } from './supabase'

// Hoặc sử dụng Supabase local
import { supabaseLocal as supabase } from './supabase-local'
```

### Hoặc tạo environment variable

Tạo file `.env.local`:
```env
REACT_APP_SUPABASE_URL=http://localhost:54321
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
```

Và cập nhật `src/supabase.ts`:
```typescript
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://wobnxsnvmsxsnmxarvcw.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-production-key'
```

## Database Schema

Schema database đã được định nghĩa trong `supabase-schema.sql` bao gồm:

- **users**: Thông tin người dùng
- **jobs**: Thông tin công việc
- **applications**: Đơn ứng tuyển
- **RLS Policies**: Bảo mật dữ liệu

## Các lệnh hữu ích

```powershell
# Khởi động Supabase
npx supabase start

# Dừng Supabase
npx supabase stop

# Kiểm tra trạng thái
npx supabase status

# Reset database
npx supabase db reset

# Tạo migration mới
npx supabase migration new migration_name

# Chạy migrations
npx supabase db push
```

## Troubleshooting

### Docker không khởi động
- Kiểm tra Docker Desktop đã chạy chưa
- Restart Docker Desktop

### Port đã được sử dụng
- Dừng các service khác đang sử dụng port 54321, 54322, 54323
- Hoặc thay đổi port trong `supabase/config.toml`

### Lỗi kết nối database
- Kiểm tra Docker containers đã chạy chưa: `docker ps`
- Restart Supabase: `npx supabase stop && npx supabase start`

## Lưu ý

- Dữ liệu local sẽ bị mất khi restart Supabase
- Sử dụng `npx supabase db reset` để reset database về trạng thái ban đầu
- Backup dữ liệu quan trọng trước khi reset 