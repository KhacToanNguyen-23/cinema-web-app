# Nhật ký thay đổi (Changelog)
Tất cả các thay đổi nổi bật của dự án này sẽ được ghi lại trong tệp này.
Dựa trên tiêu chuẩn [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [26-08-2026 23:01] - Thêm trang Quản lý Rạp Chiếu cho Admin
### Added (Thêm mới)
- `AdminCinemaPage.jsx`: Trang CRUD rạp chiếu (danh sách + modal Thêm/Sửa/Ẩn). Có stats bar tổng rạp/active/đã ẩn.
- `regionApi.js`: API client fetch danh sách khu vực phục vụ dropdown trong form.

### Changed (Thay đổi)
- `cinemaApi.js`: Bổ sung `createCinema`, `updateCinema`, `deleteCinema`.
- `AppRoutes.jsx`: Đăng ký route `/admin/cinemas` → `AdminCinemaPage`.
- `AdminLayout.jsx`: Thêm sidebar link "Rạp Chiếu" (icon `theater_comedy`), chỉ hiện với role `ADMIN`.

## [26-08-2026 22:47] - Xóa endpoint overrideStatus thừa
### Changed (Thay đổi)
- `MovieController.java`: Xóa endpoint `PATCH /api/v1/movies/{id}/status`. Admin override status bằng cách truyền field `status` vào `PUT /api/v1/movies/{id}`.
- `MovieService.java`: Xóa khai báo `overrideStatus()` khỏi interface + xóa import trùng `MovieStatus`.
- `MovieServiceImpl.java`: Xóa phương thức `overrideStatus()` và cập nhật comment trong `createMovie` cho đúng với API mới.

## [26-08-2026 22:33] - Đơn giản hóa logic tạo phim mới
### Changed (Thay đổi)
- `MovieServiceImpl.java`: Bỏ logic manual override thừa trong `createMovie`. Phim mới tạo luôn có status `COMING_SOON` và `manualStatusOverride = false`. Admin muốn override dùng endpoint `overrideStatus` riêng.

## [26-08-2026 16:30] - Phân quyền RBAC cho Manager
### Added (Thêm mới)
- `ShowtimeRepository.java`, `ShowtimeController.java`: Thêm hàm `findByRoomCinemaId` và API lọc `?cinemaId` để hỗ trợ Manager chỉ xem rạp của mình.
- `JwtService.java`: Thêm thuộc tính `cinemaId` vào JWT Claims khi User có role `MANAGER`.

### Changed (Thay đổi)
- `AdminLayout.jsx`: Cập nhật logic tự động ẩn menu "Phim" và "Users" đối với role `MANAGER`.
- `AdminShowtimePage.jsx`: Tự động lấy `cinemaId` từ JWT Token và truyền vào API khi fetch dữ liệu Lịch chiếu & Phòng chiếu.

### Fixed (Sửa lỗi)
- `Snack.java`: Sửa lỗi cú pháp dư chữ 'r' ở `@NoArgsConstructorr` gây sập khi compile Maven.

---

## [26-08-2026 17:15] - Sửa lỗi vòng lặp đăng nhập & Dữ liệu rạp của Manager
### Fixed (Sửa lỗi)
- `LoginModal.jsx` & `Header.jsx`: Sửa lỗi đăng nhập tài khoản Manager không tự động chuyển hướng vào Dashboard, thêm nút "Vào trang Quản trị" ở thanh điều hướng.
- `AdminShowtimePage.jsx`: Bổ sung cơ chế chặn sập giao diện (cảnh báo Alert) nếu tài khoản Manager chưa được cấu hình `cinemaId`.
- `DataInitializer.java`: Đảo thứ tự chạy hàm `initCinemaData()` lên trước để lấy rạp mặc định gán cho tài khoản Manager khi seed database.
- `UserManagementPage.jsx`: Bổ sung ô chọn Rạp (`cinemaId`) vào Form để Admin có thể gán rạp hợp lệ lúc tạo Manager/Staff.
- `ShowtimeDto.java` & `ShowtimeMapper.java`: Bổ sung object `Movie` và `Room` vào DTO trả về, khắc phục lỗi Frontend báo "Phim đã bị xóa" ở danh sách Lịch chiếu.
