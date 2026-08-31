# Nhật ký thay đổi (Changelog)
Tất cả các thay đổi nổi bật của dự án này sẽ được ghi lại trong tệp này.
Dựa trên tiêu chuẩn [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [31-08-2026 12:38] - Tái Cấu Trúc README.md Thành Bản Đặc Tả Yêu Cầu Hệ Thống & Nghiệp Vụ (SRS)
### Changed (Thay đổi)
- `README.md`: Chuyển đổi toàn bộ nội dung sang cấu trúc Bản Đặc Tả Yêu Cầu Phần Mềm (Software Requirements Specification - SRS): Danh mục Yêu cầu Chức năng (`REQ-FR-xx`), Yêu cầu Phi Chức năng (`REQ-NFR-xx`), Chu trình sống của ghế (Seat State Machine), Ma trận phân quyền RBAC và Ngăn xếp kiến trúc hệ thống, đồng thời bảo mật tuyệt đối không in thông tin cấu hình nhạy cảm.

## [31-08-2026 12:22] - Thiết Kế Lại Giao Diện Admin & Manager Sang Phong Cách Enterprise Office Portal
### Changed (Thay đổi)
- `docs/DESIGN.md`: Bổ sung kiến trúc thiết kế kép (Dual-Theme Architecture) và bảng màu chuẩn Modern Enterprise SaaS cho phân hệ Quản trị.
- `DashboardLayout.jsx`, `Sidebar.jsx`, `DashboardHeader.jsx`: Chuyển đổi khung layout sang phong cách Office Portal sáng sủa, thanh điều hướng Navy sắc nét và topbar trắng tinh tế.
- `AdminShowtimePage.jsx`, `AdminCinemaPage.jsx`, `AdminRoomPage.jsx`, `AdminSeatPage.jsx`, `AdminMoviePage.jsx`, `UserManagementPage.jsx`: Chuyển đổi toàn bộ các trang quản trị sang theme thẻ trắng viền mỏng, độ tương phản cao, chuẩn phần mềm văn phòng.

## [31-08-2026 12:10] - Chuẩn Hóa Phòng, Ghế & Trình Xếp Lịch Suất Chiếu Hàng Loạt Chuẩn Thực Tế
### Added (Thêm mới)
- `RoomType.java`: Enum định danh 3 loại phòng chiếu tiêu chuẩn (`STANDARD`, `IMAX`, `GOLD_CLASS`).
- `ShowtimeFormat.java`: Enum định danh 3 phiên bản chiếu (`TWO_D_SUB`, `TWO_D_DUB`, `IMAX_TWO_D`).
- `ShowtimeRepository.java`: Bổ sung query `findOverlappingShowtimes` quét xung đột giao nhau thời gian trong phòng chiếu.

### Changed (Thay đổi)
- `Room.java` & `RoomDto.java`: Chuyển đổi `roomType` sang kiểu `RoomType` Enum.
- `Showtime.java` & `ShowtimeDto.java`: Bổ sung trường `ShowtimeFormat format`.
- `ShowtimeService.java` & `ShowtimeServiceImpl.java`: Gộp chung API `createShowtimes` nhận `List<ShowtimeDto>`, tích hợp quét chống trùng lịch và lưu toàn bộ trong 1 Transaction an toàn.
- `ShowtimeController.java`: Cập nhật endpoint `POST /api/v1/showtimes` nhận `List<ShowtimeDto>`.
- `AdminShowtimePage.jsx`: Tái thiết kế toàn diện với 2 tab (Xem lịch theo phòng & Trình tạo lịch hàng loạt Batch Wizard kèm công cụ tự động nối suất và quét trùng giờ trực quan).
- `MovieDetailPage.jsx`: Phân nhóm suất chiếu hiển thị theo Định dạng (2D Phụ đề / 2D Lồng tiếng).
- `docs/DATABASE.md`: Cập nhật sơ đồ Mermaid ERD với các enum và trường mới.

## [31-08-2026 10:24] - Nâng Cấp Cấu Trúc Frontend Chuẩn Enterprise (Env, Path Alias, Utils, Constants, ErrorBoundary)
### Added (Thêm mới)
- `frontend/.env` & `frontend/.env.example`: Khai báo biến môi trường chuẩn `VITE_API_BASE_URL` và `VITE_WS_BASE_URL`.
- `frontend/jsconfig.json`: Cấu hình Intellisense cho path alias `@/*`.
- `frontend/src/utils/formatters.js`: Các helper định dạng tiền tệ VND (`formatCurrency`), ngày tháng (`formatDate`), giờ (`formatTime`), thời lượng (`formatDuration`).
- `frontend/src/constants/roles.js` & `frontend/src/constants/seatStatus.js`: Định nghĩa hằng số type-safe cho Roles và Trạng thái ghế.
- `frontend/src/components/common/ErrorBoundary.jsx`: Bắt ngoại lệ runtime render toàn cục và hiển thị fallback UI.

### Changed (Thay đổi)
- `frontend/vite.config.js`: Bổ sung cấu hình path alias `@/` trỏ về `src/`.
- `frontend/src/services/api.js`: Chuyển baseURL sang đọc từ biến môi trường `VITE_API_BASE_URL`.
- `frontend/src/hooks/useSeatWebSocket.js`: Chuyển URL SockJS sang đọc từ `VITE_WS_BASE_URL`.
- `frontend/src/main.jsx`: Bọc component toàn cục bằng `<ErrorBoundary>`.
- `frontend/src/layouts/DashboardLayout.jsx`: Chuyển đổi import từ `src/layouts/components/`.

## [31-08-2026 10:18] - Dọn Dẹp File Rác & Chuẩn Hóa Cấu Trúc Frontend
### Removed (Xóa)
- `frontend/src/assets/react.svg`, `frontend/src/assets/vite.svg`: Xóa các file icon mẫu mặc định không sử dụng từ template Vite.
- `frontend/public/toan-va-sang.png`: Xóa file ảnh thử nghiệm không sử dụng.

### Changed (Thay đổi)
- `backend/scripts/seed_movies.cjs`: Di chuyển script seed dữ liệu độc lập từ thư mục `frontend/` sang `backend/scripts/` để đảm bảo module frontend gọn gàng.

## [31-08-2026 01:01] - Bổ Sung GET Showtime By ID & Tối Ưu Nạp Sơ Đồ Ghế
### Added (Thêm mới)
- `ShowtimeController.java`: Bổ sung endpoint `@GetMapping("/{id}")` lấy chi tiết một suất chiếu theo ID.

### Changed (Thay đổi)
- `BookingSeatPage.jsx`: Sử dụng `Promise.allSettled` nạp đồng thời thông tin suất chiếu và layout ghế an toàn, ngăn chặn lỗi 404 làm gián đoạn hiển thị.

## [31-08-2026 00:50] - Nâng Cấp Bộ Lọc Cụm Rạp & Badge Đếm Suất Chiếu
### Changed (Thay đổi)
- `MovieDetailPage.jsx`: Bổ sung Bộ chọn Cụm rạp (Cinema Selector pills) theo từng khu vực; Bổ sung Badge đếm số lượng suất chiếu trên từng tab ngày (`31/8 • 4 suất`); Tự động chuyển đến ngày có lịch chiếu gần nhất.

## [31-08-2026 00:44] - Thiết Kế Luồng Đặt Vé Online Khách Hàng (Customer Booking Flow)
### Added (Thêm mới)
- `MovieDetailPage.jsx`: Giao diện chi tiết phim, xem trailer, chọn ngày xem (7 ngày tới), lọc cụm rạp theo khu vực và chọn khung giờ suất chiếu.
- `BookingSeatPage.jsx`: Giao diện Sơ đồ ghế Cinema cong phát sáng chuẩn rạp chiếu phim, tích hợp đếm ngược giữ ghế 5:00 phút, WebSocket STOMP Realtime và Bottom Sticky Checkout Bar.

### Changed (Thay đổi)
- `AppRoutes.jsx`: Đăng ký 2 routes `/movies/:id` và `/booking/:showtimeId`.
- `LandingPage.jsx`: Gắn liên kết toàn bộ nút "ĐẶT VÉ NGAY" và card phim dẫn thẳng vào luồng đặt vé online.

## [31-08-2026 00:03] - Fix Lỗi Màn Hình Đen (Vite + SockJS Polyfill)
### Fixed (Sửa lỗi)
- `vite.config.js`: Bổ sung `define: { global: 'window' }` để polyfill biến môi trường `global` cho thư viện `sockjs-client`, ngăn chặn lỗi `ReferenceError: global is not defined` gây crash màn hình.

## [30-08-2026 23:56] - Hoàn Thiện Hệ Thống Khóa Ghế Realtime (Redis + WebSocket + Staff POS)
### Added (Thêm mới)
- `RedisConfig.java`: Cấu hình RedisTemplate chuẩn hóa Serialization (String Key, JSON Value).
- `SeatLockService.java` & `SeatLockServiceImpl.java`: Dịch vụ khóa ghế bằng Redis Distributed Lock (`SETNX + EX 300` giây).
- `ShowtimeSeatController.java` & `ShowtimeSeatLayoutDto.java`: API `GET /api/v1/showtimes/{showtimeId}/seat-layout` cung cấp sơ đồ ghế kèm trạng thái thực tế (`BOOKED`, `HOLDING`, `AVAILABLE`).
- `showtimeSeatApi.js`: API client kết nối lấy layout ghế realtime.

### Changed (Thay đổi)
- `SeatWebSocketController.java`: Tích hợp `SeatLockService` để kiểm tra Redis Lock trước khi broadcast sự kiện `HOLDING`/`AVAILABLE`.
- `BookingSeatRepository.java`: Bổ sung query `findByBookingShowtimeId`.
- `StaffPOSPage.jsx`: Xóa bỏ 100% mock data, kết nối API thật của cụm rạp, tích hợp WebSocket realtime, sơ đồ ghế 3 màu (Trống, Đang giữ, Đã bán), giỏ hàng bắp nước và hóa đơn in vé.

## [30-08-2026 16:27] - Chuẩn Hóa Enum SeatStatus Cho WebSocket DTO
### Added (Thêm mới)
- `SeatStatus.java`: Enum định danh 4 trạng thái chuẩn của ghế (`AVAILABLE`, `HOLDING`, `BOOKED`, `MAINTENANCE`).

### Changed (Thay đổi)
- `SeatMessageDto.java`: Cập nhật trường `status` từ kiểu `String` sang enum `SeatStatus` Type-Safe.

## [30-08-2026 16:23] - Cập nhật Quy tắc Phân chia Trách nhiệm (Frontend Ownership)
### Changed (Thay đổi)
- `rules.md`: Bổ sung quy tắc AI chịu trách nhiệm toàn bộ phần code Frontend & review chi tiết lại với người dùng; Người dùng trực tiếp rèn luyện code Backend; Không sử dụng emoji/icon trong mã nguồn.

## [30-08-2026 16:22] - Triển khai WebSocket Realtime STOMP
### Added (Thêm mới)
- `WebSocketConfig.java`: Cấu hình Spring Boot WebSocket Message Broker với STOMP, endpoint `/ws`, tiền tố `/topic` và `/app`.
- `SeatMessageDto.java`: Gói tin DTO trao đổi sự kiện ghế Realtime (showtimeId, seatId, seatName, userId, status).
- `SeatWebSocketController.java`: Controller nhận sự kiện chọn ghế từ Client và broadcast tới các Client khác qua `SimpMessagingTemplate`.
- `useSeatWebSocket.js`: React Custom Hook quản lý vòng đời kết nối STOMP qua SockJS, subscribe topic và gửi action (Clean log, không emoji).

## [28-08-2026 22:47] - Thiết kế lại UI Quản lý Phòng Chiếu & Đồng bộ Sức chứa Ghế
### Added (Thêm mới)
- `AdminRoomPage.jsx`: Thiết kế lại toàn diện giao diện Quản lý phòng chiếu dạng **Cinema Grid Cards** cao cấp, thẻ thống kê tổng phòng / tổng sức chứa, badge loại phòng rực rỡ (`IMAX`, `4DX`, `SWEETBOX`, `STANDARD`), nút thao tác "Sơ đồ ghế" trực quan.

### Changed (Thay đổi)
- `SeatServiceImpl.java`: Tự động tính toán tổng số ghế active và cập nhật vào `room.capacity` sau khi lưu danh sách ghế.

## [28-08-2026 22:43] - Dọn dẹp Schema Database Bảng seats
### Changed (Thay đổi)
- `PostgreSQL Database`: Thực thi `ALTER TABLE seats DROP COLUMN seat_number` để loại bỏ cột thừa từ schema cũ, đồng bộ với cấu trúc `seat_row` + `seat_column`.
- `DATABASE.md`: Bổ sung bảng `ROOMS` và `SEATS` vào sơ đồ Mermaid ERD.

## [28-08-2026 22:21] - Mở quyền Quản lý Phòng chiếu & Sơ đồ Ghế cho Manager
### Changed (Thay đổi)
- `AdminLayout.jsx`: Cấp quyền truy cập menu "Phòng Chiếu" cho cả role `ADMIN` và `MANAGER`.
- `AdminRoomPage.jsx`: Tự động nhận diện role `MANAGER`, cố định rạp theo `cinemaId` của Manager và ẩn dropdown chọn rạp khác.

## [28-08-2026 21:41] - Thêm trang Quản lý Phòng chiếu & Sơ đồ Ghế
### Added (Thêm mới)
- `AdminRoomPage.jsx`: Trang CRUD phòng chiếu — dropdown chọn rạp, list phòng, modal Thêm/Sửa, nút "Quản lý ghế →".
- `AdminSeatPage.jsx`: Trang sơ đồ ghế — generate lưới rows×cols, click ghế xoay type (NORMAL→VIP→COUPLE→Inactive), lưu bulk lên server.
- `seatApi.js`: API client cho Seat (`getSeatsByRoom`, `createSeats`, `updateSeat`, `deleteSeat`).

### Changed (Thay đổi)
- `roomApi.js`: Bổ sung `createRoom`, `updateRoom`, `deleteRoom`.
- `AppRoutes.jsx`: Thêm route `/admin/rooms` và `/admin/rooms/:roomId/seats`.
- `AdminLayout.jsx`: Thêm sidebar link "Phòng Chiếu" (icon `meeting_room`), chỉ ADMIN.

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
