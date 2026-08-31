# Kế hoạch triển khai (Implementation Plan)

## Mục tiêu hiện tại
Nâng cấp tính năng Thêm Lịch Chiếu từ "Tạo đơn lẻ" (Single Create) thành "Tạo hàng loạt" (Bulk Create) để tối ưu UX cho Manager. Rạp trưởng không cần phải mỏi tay nhập 20 lần cho 20 suất chiếu trong một ngày nữa.

## User Review Required
> [!TIP]
> **Quy trình mới (Chuẩn thực tế):**
> 1. Manager chọn Phim, Phòng chiếu, Giá vé và **Ngày chiếu** (VD: 27/08/2026).
> 2. Manager chỉ cần bấm thêm các **Giờ bắt đầu** (VD: 08:00, 10:30, 14:00, 19:00).
> 3. Hệ thống sẽ **tự động tính Giờ kết thúc (End Time)** dựa vào thời lượng phim (Duration) của bộ phim đó.
> 4. Bấm Lưu 1 phát -> Frontend sẽ tự động sinh ra 20 suất chiếu và đẩy lên Backend.

## Proposed Changes

### [MODIFY] `frontend/src/pages/admin/AdminShowtimePage.jsx`
- Sửa đổi cấu trúc `formData` trong form Thêm/Sửa. Bỏ `startTime` và `endTime` cũ, thay bằng:
  - `showDate`: Ngày chiếu (YYYY-MM-DD).
  - `timeSlots`: Mảng các giờ chiếu (Ví dụ: `['08:00', '10:00']`).
- Giao diện Form sẽ cho phép "Thêm khung giờ" bằng một nút bấm (+).
- Trong hàm `handleSubmit`:
  - Tìm `movie` đang được chọn để lấy `duration` (thời lượng).
  - Dùng vòng lặp tạo ra một mảng các payload. Mỗi payload sẽ cộng `showDate` + `time` ra `startTime`, và cộng thêm `duration` ra `endTime`.
  - Dùng `Promise.all` để gọi API `createShowtime` nhiều lần cùng lúc.

## Verification Plan
- Chờ người dùng duyệt (Proceed).
- Code xong sẽ yêu cầu người dùng F5, thử chọn 1 phim, chọn 1 ngày và nhập 3 khung giờ khác nhau rồi bấm Lưu xem có ra 3 dòng lịch chiếu không.
