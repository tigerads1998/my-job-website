# 📋 HƯỚNG DẪN POST JOBS TỪ TEMPLATES

## 🚀 **TỔNG QUAN**

Hệ thống template cho phép bạn tạo và post hàng chục jobs một cách nhanh chóng và nhất quán. Bạn chỉ cần tạo file JSON theo format chuẩn và chạy script.

## 📁 **CẤU TRÚC FILE**

```
Website/
├── job-templates/                    # Thư mục chứa templates
│   ├── content-strategist.json      # ✅ Job vừa được post
│   ├── backend-developer.json       # ✅ Job vừa được post  
│   ├── marketing-specialist.json    # ✅ Job vừa được post
│   ├── data-analyst.json           # ✅ Job vừa được post
│   ├── sales-representative.json    # ✅ Job vừa được post
│   ├── internship-marketing.json    # ✅ Job vừa được post
│   └── product-manager.json         # ✅ Job vừa được post
├── job-template-example.json        # Template mẫu để copy
└── post-jobs-from-templates.js      # Script để post jobs
```

## 📝 **FORMAT TEMPLATE CHUẨN**

Mỗi template phải có format JSON như sau:

```json
{
  "title": "Tên Position",
  "company": "Tên Công Ty", 
  "location": "Thành phố, Quốc gia",
  "type": "full-time|part-time|contract|internship",
  "work_model": "remote|hybrid|on-site",
  "salary_min": 1000,
  "salary_max": 1500,
  "description": "HTML description với styling inline...",
  "requirements": [
    "Requirement 1",
    "Requirement 2",
    "..."
  ],
  "benefits": [
    "Benefit 1", 
    "Benefit 2",
    "..."
  ]
}
```

## 🎨 **STYLING CHO DESCRIPTION**

Template description sử dụng HTML với inline CSS. Có 3 styles chính:

### **Style 1: Professional (Medium Length)**
```html
<div class="job-description" style="line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">

<div style="margin-bottom: 24px;">
<h3 style="margin: 0 0 12px 0; font-size: 1.2rem; color: #1a202c; font-weight: 600;">About the Role</h3>
<p style="margin: 0; color: #4a5568; font-size: 0.95rem;">Description text...</p>
</div>

<div style="margin-bottom: 24px;">
<h3 style="margin: 0 0 12px 0; font-size: 1.2rem; color: #1a202c; font-weight: 600;">Key Responsibilities</h3>
<ul style="margin: 0; padding-left: 18px; color: #4a5568; font-size: 0.95rem;">
<li style="margin-bottom: 6px; line-height: 1.5;">Task 1</li>
<li style="margin-bottom: 6px; line-height: 1.5;">Task 2</li>
</ul>
</div>

</div>
```

### **Style 2: Startup/Casual (Short Length)**
```html
<div class="job-description" style="line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">

<div style="margin-bottom: 20px;">
<p style="margin: 0; color: #4a5568; font-size: 0.95rem;">Casual description...</p>
</div>

<div style="margin-bottom: 18px;">
<h3 style="margin: 0 0 8px 0; font-size: 1.1rem; color: #1a202c;">What you'll do:</h3>
<ul style="margin: 0; padding-left: 16px; color: #4a5568;">
<li style="margin-bottom: 4px;">Task 1</li>
<li style="margin-bottom: 4px;">Task 2</li>
</ul>
</div>

</div>
```

### **Style 3: Premium/Enterprise (Long Length)**
```html
<div class="job-description" style="line-height: 1.65; font-family: 'Inter', Helvetica, sans-serif;">

<div style="margin-bottom: 30px;">
<h3 style="margin: 0 0 15px 0; font-size: 1.25rem; color: #1e293b; font-weight: 700;">About Company</h3>
<p style="margin: 0; color: #475569; font-size: 0.9rem;">Detailed description...</p>
</div>

</div>
```

## 🔧 **CÁCH SỬ DỤNG**

### **Bước 1: Tạo Template Mới**
1. Copy file `job-template-example.json`
2. Đổi tên thành `your-job-name.json`
3. Đặt vào thư mục `job-templates/`
4. Chỉnh sửa nội dung theo ý muốn

### **Bước 2: Chỉnh Sửa Template**
- **title**: Tên position chính xác
- **company**: Tên công ty (có thể là startup hoặc công ty thật)
- **location**: Thành phố, quốc gia
- **type**: `full-time`, `part-time`, `contract`, `internship`
- **work_model**: `remote`, `hybrid`, `on-site`
- **salary_min/max**: Mức lương USD/tháng
- **description**: HTML content với styling
- **requirements**: Array các yêu cầu
- **benefits**: Array các quyền lợi

### **Bước 3: Post Jobs**
```bash
# Post tất cả templates trong thư mục job-templates/
node post-jobs-from-templates.js post

# Post từ thư mục khác
node post-jobs-from-templates.js post ./my-custom-templates
```

### **Bước 4: Kiểm Tra Kết Quả**
- Script sẽ báo cáo số jobs thành công/thất bại
- Jobs được post sẽ xuất hiện trên website ngay lập tức
- Check tại: http://localhost:3003/jobs

## 📊 **KẾT QUẢ VỪA POST**

✅ **7 jobs đã được post thành công:**
1. **Content Strategist** - SparkVibe Studio (Lisbon, Portugal) - Part-time/Hybrid
2. **Senior Backend Developer** - DataCore Systems (Austin, TX) - Full-time/Remote  
3. **Digital Marketing Specialist** - GrowthLab Marketing (Miami, FL) - Full-time/Hybrid
4. **Data Analyst** - InsightTech Analytics (Chicago, IL) - Full-time/Remote
5. **Sales Representative** - SalesForce Dynamics (New York, NY) - Full-time/On-site
6. **Marketing Intern** - StartupHub Ventures (Los Angeles, CA) - Internship/Hybrid
7. **Product Manager** - InnovateTech (Seattle, WA) - Full-time/Hybrid

## 💡 **TIPS & BEST PRACTICES**

### **1. Đa Dạng Content Length**
- **30% Short**: Startup style, casual, 3-4 sections
- **50% Medium**: Professional style, 5-6 sections  
- **20% Long**: Enterprise style, 7+ sections

### **2. Salary Ranges Realistic**
- **Internship**: $800-1,200/month
- **Entry Level**: $1,000-1,500/month
- **Mid Level**: $1,500-2,200/month
- **Senior Level**: $2,000-3,000/month

### **3. Location Diversity**
Sử dụng các thành phố khác nhau:
- US: San Francisco, New York, Austin, Chicago, Seattle, Miami
- Europe: London, Berlin, Amsterdam, Lisbon, Barcelona
- Asia: Singapore, Tokyo, Seoul, Bangkok

### **4. Company Names**
Tạo tên công ty startup realistic:
- TechFlow, DataCore, SparkVibe, GrowthLab
- InsightTech, StartupHub, InnovateTech
- VelocityAI, NeuralNet, LightSpeed

### **5. Work Models Balance**
- **40% Remote**: Thu hút ứng viên toàn cầu
- **35% Hybrid**: Cân bằng linh hoạt
- **25% On-site**: Phù hợp một số vị trí

## 🚀 **TẠOS HÀNG CHỤC JOBS NHANH**

1. **Tạo 20-30 templates** với các position khác nhau
2. **Đa dạng styling** (short/medium/long)
3. **Mix các work models** và locations
4. **Run script một lần** để post tất cả
5. **Website sẽ có hàng chục jobs** đa dạng và realistic

## 🔍 **TROUBLESHOOTING**

### **Lỗi UUID**: 
- ✅ Đã fix: Script tự động set `employer_id = null`

### **Lỗi JSON Syntax**:
- Kiểm tra dấu phẩy, ngoặc kép
- Validate JSON trước khi save

### **Lỗi Database Connection**:
- Đảm bảo Supabase local đang chạy
- Check port 54321

### **Jobs không hiển thị**:
- Check `is_active: true` trong template
- Refresh browser cache

---

## 📞 **SUPPORT**

Nếu cần hỗ trợ thêm templates hoặc gặp lỗi, hãy báo ngay để được fix! 