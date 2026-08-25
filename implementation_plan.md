# Kế hoạch Triển khai (Core Booking Flow)

Theo triết lý "ưu tiên luồng giá trị cốt lõi" (Core Value Stream), chúng ta sẽ tập trung toàn lực vào việc xây dựng luồng **Khách hàng mua vé xem phim**. 

Tuy nhiên, để khách hàng *có thể mua được vé*, hệ thống cần phải có Dữ liệu nền tảng (Rạp, Phim, Lịch). Do đó, kế hoạch chức năng sẽ được chia thành 3 giai đoạn ràng buộc chặt chẽ với nhau:

## Giai đoạn 1: Master Data (Dữ liệu nền tảng - Làm nhanh)
Mục tiêu: Xây dựng dữ liệu cốt lõi để tạo ra các suất chiếu.
1. **Quản lý Phim (Movie):**
   - CRUD thông tin phim (Tên, Ảnh poster, Thời lượng, Giới hạn tuổi).
2. **Cấu trúc Rạp & Phòng chiếu (Cinema - Room - Seat):**
   - 1 Rạp (Cinema) có nhiều Phòng (Room).
   - 1 Phòng (Room) có cấu hình mảng Ghế (Seat) cố định (Ví dụ: 10x10 ghế).

## Giai đoạn 2: Lịch chiếu (Showtime - Cầu nối)
Mục tiêu: Đưa phim vào rạp phục vụ khách.
1. **Tạo Lịch chiếu:** 
   - Admin chọn Phim X, chiếu ở Phòng Y, vào khung giờ Z.
   - *Điểm mấu chốt về bản chất:* Khi có Lịch chiếu, hệ thống phải sinh ra trạng thái của các ghế cho riêng khung giờ đó (BookingSeat).

## Giai đoạn 3: Luồng Đặt Vé Cốt Lõi (Customer Booking Flow - Trọng tâm)
Đây là phần khó nhất, yêu cầu xử lý logic chặt chẽ.
1. **Bước 1: Chọn Lịch (Showtime Selection):**
   - Hiển thị danh sách Phim đang chiếu -> Khách chọn Rạp -> Chọn Giờ chiếu.
2. **Bước 2: Giao diện Sơ đồ ghế (Seat Selection):**
   - Hiển thị sơ đồ ghế thực tế của Phòng chiếu.
   - *Logic lõi:* Phân biệt Ghế trống (Available), Ghế đang có người chọn (Hold - Tránh đụng độ/Concurrent booking), Ghế đã bán (Sold).
3. **Bước 3: Chọn Combo Bắp Nước (Snack):**
   - Khách có thể chọn thêm bắp nước. (Tùy chọn)
4. **Bước 4: Thanh toán (Checkout):**
   - Chốt tổng tiền. 
   - Tạm thời làm nút "Thanh toán Demo" (chưa tích hợp ví thật).
5. **Bước 5: Phát hành vé (Ticket & QR Code):**
   - Cập nhật trạng thái ghế thành "Sold". Sinh mã vé, hiển thị trong mục "Vé của tôi".

---
## User Review Required
> [!IMPORTANT]
> Đây là lộ trình chức năng (Functional Roadmap). Chúng ta bắt buộc phải đi qua Giai đoạn 1 và 2 trước thì mới có dữ liệu thật để code Giai đoạn 3 (Luồng mua vé). 
