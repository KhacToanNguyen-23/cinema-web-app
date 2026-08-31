# Tài liệu Quy chuẩn Thiết kế Giao diện (Design System - Cinema Web App)

Dự án áp dụng **Kiến trúc Thiết kế Kép (Dual-Theme Architecture)** nhằm phục vụ tối ưu cho 2 đối tượng người dùng với 2 mục đích hoàn toàn khác biệt:

---

## 🏛️ TỔNG QUAN: KIẾN TRÚC THIẾT KẾ KÉP (Dual-Theme System)

| Phân hệ | Đối tượng | Phong cách Thiết kế | Tông màu Chủ đạo | Mục tiêu Cốt lõi |
| :--- | :--- | :--- | :--- | :--- |
| **Client Site** (Khách hàng) | Người xem phim | **Cinematic Dark Mode** (Rạp phim huyền bí) | Nền đen tuyền (`#000000`), Nâu xám (`#141414`), Đỏ / Vàng rực rỡ | Tạo cảm xúc đắm chìm, nổi bật poster, kích thích trải nghiệm xem phim. |
| **Management Portal** (Admin & Manager) | Quản lý rạp, Ban quản trị | **Modern Enterprise Office Portal** (SaaS Công sở Sáng) | Nền xám dịu (`#F8FAFC`), Thẻ trắng (`#FFFFFF`), Xanh dương công sở (`#2563EB`) | Năng suất làm việc cao, độ tương phản sắc nét, giảm mỏi mắt khi nhập liệu 8h/ngày. |

---

## 🌓 PHẦN A: QUY CHUẨN DESIGN CHO PHÂN HỆ QUẢN TRỊ (Admin & Manager Portal)

### 1. Triết lý Thiết kế (Design Philosophy)
- **Data-Dense & Clean:** Tối ưu hóa mật độ hiển thị thông tin nhưng vẫn giữ độ thoáng ("breathable"), số liệu rõ nét, không dùng hiệu ứng bóng mờ rườm rà.
- **High Contrast & Readability:** Chữ đen đậm trên nền trắng/xám giúp quản lý đọc số liệu, lịch chiếu và ma trận ghế nhanh chóng, không bị chói mắt trong môi trường văn phòng ban ngày.
- **Modern Enterprise SaaS:** Lấy cảm hứng từ các phần mềm quản trị doanh nghiệp hàng đầu thế giới (Linear, Stripe Dashboard, Jira, Notion).

### 2. Bảng Màu Chuẩn (Color Palette - Office Portal)
- **Nền Làm Việc (Workspace Background):** `#F8FAFC` (`bg-slate-50`) hoặc `#F1F5F9` (`bg-slate-100/60`).
- **Thẻ Dữ Liệu & Container (Cards & Panels):** `#FFFFFF` (`bg-white`), bo góc nhẹ (`rounded-xl`), viền mỏng (`border border-slate-200/80`), đổ bóng nhẹ (`shadow-sm`).
- **Thanh Điều Hướng (Sidebar):** Tone màu Dark Navy Slate (`#0F172A` - `bg-slate-900`) hoặc Clean White (`#FFFFFF`).
- **Thanh Tiêu Đề (Topbar / Header):** `#FFFFFF` (`bg-white/95 backdrop-blur`), viền dưới `#E2E8F0` (`border-b border-slate-200`).
- **Màu Nhấn Hành Động (Primary Accent):**
  - Xanh dương công sở (Business Blue): `#2563EB` (`bg-blue-600 hover:bg-blue-700 text-white`). Dùng cho nút bấm chính (Thêm mới, Lưu, Xác nhận).
- **Màu Chữ (Typography Contrast):**
  - Chữ chính (Headings, Values): `#0F172A` (`text-slate-900` - Đen xám đậm).
  - Chữ phụ (Labels, Metadata): `#64748B` (`text-slate-500` - Xám trung tính).
- **Màu Trạng Thái (Semantic Status Badges):**
  - **Hoạt động / Thành công (Active):** Nền xanh nhạt `#ECFDF5`, chữ xanh `#047857`, viền `#A7F3D0`.
  - **Tạm dừng / Vô hiệu hóa (Inactive):** Nền xám `#F1F5F9`, chữ xám `#475569`, viền `#CBD5E1`.
  - **Cảnh báo / Trùng lịch (Warning/Conflict):** Nền đỏ nhạt `#FEF2F2`, chữ đỏ `#B91C1C`, viền `#FECACA`.
  - **VIP / Nổi bật:** Nền vàng cam nhạt `#FFFBEB`, chữ vàng nâu `#B45309`, viền `#FDE68A`.

### 3. Quy chuẩn Các Thành Phần Giao Diện Quản Trị (Components)

#### A. Nút Bấm (Buttons)
- **Primary Button:** `bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-sm transition-all`.
- **Secondary Button:** `bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold px-4 py-2 rounded-lg shadow-sm`.
- **Danger Button:** `bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-semibold px-3 py-1.5 rounded-lg`.

#### B. Bảng Dữ Liệu (Data Tables)
- **Header Bảng:** Nền xám nhạt (`bg-slate-50` hoặc `bg-slate-100/70`), chữ hoa in nhỏ (`text-xs uppercase font-semibold text-slate-500`).
- **Hàng (Rows):** Nền trắng, phân tách bằng đường kẻ thanh mảnh (`divide-y divide-slate-100`).
- **Hiệu ứng Hover:** `hover:bg-blue-50/40` giúp nhận diện dòng đang trỏ chuột.

#### C. Ô Nhập Liệu (Form Controls & Inputs)
- Nền trắng (`bg-white`), viền xám (`border border-slate-300`), chữ đen (`text-slate-900`).
- Khi Focus: Viền xanh dương sắc nét (`focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`).

---

## 🎬 PHẦN B: QUY CHUẨN DESIGN CHO PHÂN HỆ KHÁCH HÀNG (Client Site)

### 1. Triết lý Thiết kế (Design Philosophy)
- **Cinematic Experience:** Nền tối huyền bí (Dark Mode) làm nền tảng cho poster phim và video trailer phát sáng.
- **Image-Heavy:** Sử dụng poster tỉ lệ chuẩn **2:3**, hiệu ứng chuyển động mượt mà khi hover.

### 2. Bảng Màu Chuẩn (Color Palette - Client Movie Site)
- **Background chính:** `#000000` (Đen tuyền) và `#0B0F19` (Slate 950).
- **Cards & Containers:** `#111827` (Slate 900) viền `#1F2937` (Slate 800).
- **Primary Accent:** Vàng hổ phách `#F59E0B` (Amber 500) hoặc Đỏ rạp phim `#E50914`.
- **Text:** Trắng tuyền `#FFFFFF` (Tiêu đề) và Xám bạc `#94A3B8` (Nội dung mô tả).

### 3. Sơ Đồ Chọn Ghế (Seat Matrix)
- Mô phỏng màn hình chiếu cong phát sáng (Curved Screen Glow).
- Ghế Thường: Viền xám mờ `#334155`.
- Ghế VIP: Vàng Gold `#F59E0B`.
- Ghế Couple: Hồng tím `#EC4899`.
- Ghế Đang Chọn: Xanh phát sáng `#22C55E`.
- Ghế Đã Bán: Xám tối `#1E293B` (Vô hiệu hóa).
