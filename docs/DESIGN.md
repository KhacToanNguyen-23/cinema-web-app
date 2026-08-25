# Tài liệu Quy chuẩn Thiết kế UI (Design System - Cinema Web App)

## 1. Triết lý thiết kế (Design Concept)
- **Cinematic Experience:** Giao diện lấy cảm hứng từ rạp chiếu phim thực tế. Mặc định sử dụng **Dark Mode** (Nền tối) để làm nổi bật các Poster phim và mang lại cảm giác đắm chìm (immersive).
- **Image-Heavy:** Sử dụng nhiều hình ảnh độ phân giải cao (Banner, Poster, Trailer). Các phần tử UI khác phải được thiết kế tối giản để không tranh giành sự chú ý với hình ảnh phim.

## 2. Bảng màu chủ đạo (Color Palette)
- **Background (Nền):** 
  - Đen tuyền: `#000000` (Cho nền chính)
  - Xám đậm: `#141414` hoặc `#1A1A1A` (Cho các Section hoặc Card)
- **Primary Color (Màu nhấn chính):**
  - Đỏ rạp phim (CGV/Netflix Red): `#E50914` hoặc `#D22027`. Dùng cho nút bấm chính (Book Ticket), viền active.
- **Text Color (Màu chữ):**
  - Text chính: `#FFFFFF` (Trắng)
  - Text phụ (Mô tả, ngày tháng): `#B3B3B3` hoặc `#A1A1A1`
- **Semantic Colors (Màu trạng thái - Rất quan trọng cho sơ đồ ghế):**
  - Ghế đang chọn (Selecting): Xanh lá cây `#4CAF50` hoặc viền đỏ.
  - Ghế đã bán (Booked): Xám mờ `#555555` (Disable).
  - Ghế VIP: Vàng Gold `#FFD700`.

## 3. Typography (Phông chữ)
- **Font chữ chính:** `Montserrat` hoặc `Inter` (Sans-serif hiện đại, dễ đọc, phù hợp với số và giá tiền).
- **Tiêu đề (H1, H2):** In đậm (Bold), có thể viết hoa (Uppercase) đối với Tên Phim.
- **Đoạn văn (Body):** Regular (Cỡ chữ 14px - 16px).

## 4. Quy chuẩn các thành phần UI (Components)
### A. Nút bấm (Buttons)
- **Primary Button:** Nền Đỏ (`#E50914`), chữ trắng, bo góc vừa phải (Border-radius: 4px hoặc 8px). Khi hover có hiệu ứng sáng lên (Glow).
- **Secondary Button:** Nền trong suốt (Transparent), viền trắng hoặc xám.

### B. Thẻ Phim (Movie Cards)
- Tỉ lệ ảnh (Aspect Ratio): **2:3** (Tỉ lệ chuẩn của Poster phim dọc).
- **Hiệu ứng Hover:** Khi trỏ chuột vào card, hình ảnh zoom nhẹ (scale 1.05), xuất hiện lớp phủ (overlay) màu đen mờ kèm nút "Đặt vé" hoặc "Xem Trailer".

### C. Giao diện chọn ghế (Seat Selection Layout)
- Cần có mô phỏng **Màn hình chiếu** (Screen) ở phía trên cùng, dạng đường cong.
- Lưới ghế (Grid) chia đều, có đánh số (A1, A2...) hoặc chú thích màu rõ ràng.

### D. Header & Navigation
- Navbar dính (Sticky Header).
- Khi ở đầu trang (Top), nền Navbar trong suốt. Khi cuộn trang (Scroll), Navbar chuyển sang màu nền Đen mờ (Kính mờ - Backdrop blur) để đọc chữ dễ hơn.

## 5. Layout & Grid
- Chiều rộng tối đa (Max-width) cho Container: `1200px` hoặc `1440px`.
- Khoảng cách (Spacing) rộng rãi, tạo độ "thở" giữa các cụm phim Đang chiếu / Sắp chiếu.
