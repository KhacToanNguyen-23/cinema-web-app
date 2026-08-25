# Master AI Rules & Workflow Guidelines
# File này chứa các quy tắc bắt buộc áp dụng cho mọi AI Agent trong dự án này.

## Quy trình làm việc bắt buộc (Strict Workflow)
1. **Đọc Context:** Khi nhận yêu cầu mới, trước tiên hãy đọc tài liệu nghiệp vụ trong `docs/PRODUCT.md` và tài liệu kỹ thuật/thiết kế trong `docs/`.
2. **Lên kế hoạch:** Viết hoặc cập nhật bản phác thảo kế hoạch trong `implementation_plan.md`. Mô tả chi tiết những tệp tin sẽ sửa đổi và cách xác minh.
3. **Chờ phê duyệt:** Dừng lại và chờ người dùng gõ "Proceed" hoặc xác nhận đồng ý mới được bắt đầu viết code.
4. **Cập nhật Tiến độ:** Tạo/cập nhật danh sách công việc trong `task.md`. Đánh dấu trạng thái làm việc bằng `[/]` và hoàn thành bằng `[x]`.
5. **Kiểm tra chất lượng:** Trước khi hoàn tất, đối chiếu mã nguồn với các tiêu chuẩn kỹ thuật. Bắt buộc chạy thử các bài test và đảm bảo test chạy thành công.
