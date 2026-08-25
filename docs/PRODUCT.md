# Tài liệu Đặc tả Yêu cầu Phần mềm (SRS) - Cinema Web App

## 1. Giới thiệu chung (Introduction)
- **Tên dự án:** Cinema Web App (Lấy cảm hứng từ mô hình CGV).
- **Mục tiêu:** Xây dựng một nền tảng web toàn diện phục vụ việc tra cứu thông tin phim, lịch chiếu và đặt vé xem phim trực tuyến, đồng thời cung cấp hệ thống quản lý rạp chiếu cho ban quản trị.

## 2. Các nhóm Người dùng (User Roles)
1. **Khách vô danh (Guest):** Có thể xem phim, lịch chiếu nhưng phải đăng nhập để đặt vé.
2. **Khách hàng thành viên (Member):** Người dùng đã có tài khoản. Được phép đặt vé, mua combo, tích điểm và xem lịch sử giao dịch.
3. **Quản trị viên rạp (Cinema Admin):** Quản lý lịch chiếu, nhân viên, quét mã QR vé tại rạp.
4. **Quản trị viên hệ thống (Super Admin):** Toàn quyền hệ thống, quản lý danh sách Phim, danh sách Rạp, Thống kê doanh thu toàn quốc.

## 3. Các tính năng chính (Functional Requirements)

### 3.1. Dành cho Khách hàng (Customer Site)
- **Trang chủ:** Hiển thị Banner quảng cáo, danh sách Phim Đang chiếu (Now Showing), Phim Sắp chiếu (Coming Soon).
- **Chi tiết Phim:** Hiển thị Poster, Trailer (nhúng YouTube), tóm tắt nội dung, đạo diễn, diễn viên, độ tuổi giới hạn.
- **Hệ thống Rạp:** Liệt kê các cụm rạp theo khu vực (Ví dụ: TP.HCM, Hà Nội) và thông tin địa chỉ.
- **Lịch chiếu & Đặt vé (Booking Flow):**
  - *Bước 1:* Chọn Phim -> Chọn Rạp -> Chọn Ngày giờ chiếu.
  - *Bước 2:* Chọn ghế ngồi (Giao diện sơ đồ phòng chiếu: Ghế thường, Ghế VIP, Ghế đôi/Sweetbox, Ghế đã được đặt).
  - *Bước 3:* Chọn Bắp & Nước (Combo popcorn, drinks).
  - *Bước 4:* Thanh toán (Thẻ tín dụng, Momo, ZaloPay hoặc Thanh toán tại rạp).
  - *Bước 5:* Nhận vé điện tử (Mã QR/Barcode) qua Email và lưu vào tài khoản.
- **Tài khoản cá nhân:** Quản lý thông tin, đổi mật khẩu, xem lịch sử mua vé, xem thẻ thành viên & điểm tích lũy.

### 3.2. Dành cho Quản trị viên (Admin Dashboard)
- **Quản lý Danh mục:** Thêm/Sửa/Xóa Thể loại phim, Khu vực rạp.
- **Quản lý Phim:** Đăng tải thông tin phim mới.
- **Quản lý Rạp & Phòng chiếu:** Tạo sơ đồ ghế cho từng phòng chiếu (vd: Phòng 1 có 100 ghế, Phòng IMAX).
- **Quản lý Lịch chiếu:** Sắp xếp phim vào phòng chiếu theo các khung giờ (Đảm bảo không bị trùng lặp).
- **Quản lý Đơn hàng & Vé:** Tra cứu mã đặt chỗ, hỗ trợ hủy vé/đổi vé.
- **Báo cáo Thống kê:** Biểu đồ doanh thu theo phim, theo rạp, theo thời gian.

## 4. Các Ràng buộc Nghiệp vụ (Business Rules)
- **Ràng buộc giữ ghế:** Ghế sẽ bị khóa tạm thời (Hold) trong 5-10 phút khi người dùng chuyển sang bước thanh toán. Nếu thanh toán thất bại, ghế sẽ được nhả ra.
- **Ràng buộc thời gian đặt vé:** Khách hàng chỉ được phép đặt vé và hủy vé trước giờ chiếu ít nhất 30 phút.
- **Ràng buộc độ tuổi:** Cảnh báo giới hạn độ tuổi khi khách hàng đặt vé các phim C13, C16, C18.

## 5. Yêu cầu Phi chức năng (Non-Functional Requirements)
- **Giao diện (UI/UX):** Tone màu tối (Dark Mode) giống CGV để tạo cảm giác điện ảnh. Tương thích chuẩn Responsive trên cả Desktop và Mobile.
- **Bảo mật:** Mật khẩu phải được mã hóa (Bcrypt). API phải được bảo vệ bằng JWT.
- **Hiệu năng:** Hệ thống phải xử lý tốt vấn đề Concurrent Booking (Hai người cùng bấm chọn một ghế cùng lúc - Cần sử dụng cơ chế Lock trong Database).
