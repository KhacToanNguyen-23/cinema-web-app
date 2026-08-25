---
name: sample-skill-template
description: Đây là một kỹ năng mẫu. Mở file này ra để xem cách viết. Hãy đổi tên thư mục, sửa lại trường 'name' và 'description' để dạy AI một quy trình làm việc mới.
---

# Tên Kỹ năng của bạn (VD: Hướng dẫn tạo luồng API chuẩn)

## 1. Khi nào thì sử dụng kỹ năng này?
Kỹ năng này sẽ được AI Agent tự động gọi khi User yêu cầu: "[Điền điều kiện vào đây. Vd: 'Hãy tạo cho tôi một API quản lý User']".

## 2. Quy trình từng bước (Step-by-step Workflow)
Khi thực thi kỹ năng này, AI **BẮT BUỘC** phải làm theo đúng thứ tự các bước sau:

1. **Bước 1 - Phân tích:** [VD: Đọc cấu trúc Database hiện tại trước khi code].
2. **Bước 2 - Viết Code:** [VD: Bắt buộc tạo class DTO trước, sau đó mới tạo Entity và Repository].
3. **Bước 3 - Cập nhật:** [VD: Viết xong phải cập nhật lại file implementation_plan.md].
4. **Bước 4 - Kiểm tra:** [VD: Tự động chạy lệnh `mvn test` hoặc `npm run build` để xác minh].

## 3. Các lệnh cấm (Anti-patterns / Strict Constraints)
- **KHÔNG BAO GIỜ:** [VD: Xóa comment cũ của dev viết trong code].
- **TUYỆT ĐỐI KHÔNG:** [VD: Dùng `console.log` khi viết code React, phải dùng thư viện log chuẩn].
