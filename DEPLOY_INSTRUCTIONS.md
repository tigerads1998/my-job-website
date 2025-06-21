# 🚀 HƯỚNG DẪN DEPLOY LÊN NETLIFY

## ✅ Đã chuẩn bị sẵn:
- ✅ Build thành công (`npm run build`)
- ✅ Có folder `build` chứa static files
- ✅ Có file `netlify.toml` cấu hình
- ✅ Supabase config sử dụng environment variables

## 🎯 CÁCH 1: DRAG & DROP (ĐƠN GIẢN NHẤT)

### Bước 1: Truy cập Netlify
1. Mở https://app.netlify.com/
2. Đăng nhập với account: tigerads1998@gmail.com

### Bước 2: Deploy
1. Vào trang chính của Netlify
2. Kéo thả folder `build` vào vùng "Want to deploy a new site without connecting to Git?"
3. Netlify sẽ tự động upload và deploy

### Bước 3: Cấu hình Environment Variables
Sau khi deploy xong, bạn cần thêm Supabase credentials:

1. Vào Settings → Environment variables
2. Thêm 2 biến:
   - `REACT_APP_SUPABASE_URL`: URL của Supabase project
   - `REACT_APP_SUPABASE_ANON_KEY`: Anon key của Supabase

### Bước 4: Redeploy
Sau khi thêm env vars, click "Trigger deploy" để build lại với credentials mới.

## 🎯 CÁCH 2: NETLIFY CLI (CHO DEV)

```bash
# 1. Build project
npm run build

# 2. Deploy lần đầu (draft)
netlify deploy --dir=build

# 3. Deploy production
netlify deploy --prod --dir=build
```

## 📋 CHECKLIST SAU KHI DEPLOY

- [ ] Website load được
- [ ] Jobs hiển thị (cần Supabase production)
- [ ] Navigation hoạt động
- [ ] Responsive trên mobile
- [ ] Forms submit được
- [ ] Search functionality

## 🔧 NẾU CÓ LỖI

### Lỗi: Jobs không load
➡️ Kiểm tra Environment Variables trong Netlify
➡️ Đảm bảo Supabase production đang chạy

### Lỗi: 404 khi refresh page
➡️ File `netlify.toml` đã có redirect rules

### Lỗi: Build failed
➡️ Kiểm tra warnings trong build log
➡️ Fix unused imports nếu cần

## 🌟 DOMAIN CUSTOM (TÙY CHỌN)

1. Vào Site settings → Domain management
2. Add custom domain
3. Update DNS records theo hướng dẫn Netlify

---

**🎉 Chúc mừng! Website của bạn đã sẵn sàng cho thế giới!** 