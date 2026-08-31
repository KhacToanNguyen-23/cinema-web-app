# Master AI Rules & Workflow Guidelines
# File này chứa các quy tắc bắt buộc áp dụng cho mọi AI Agent trong dự án này.

> **CRITICAL RULE: OVERRIDE DEFAULT PLANNING MODE.**
> Tuyệt đối không có ngoại lệ. Ngay cả với những yêu cầu cực kỳ đơn giản (trivially simple), sửa lỗi nhỏ (minor bug fixes), hay tinh chỉnh nhỏ (simple tweaks), AI **BẮT BUỘC** phải lập kế hoạch vào `implementation_plan.md` và dừng lại chờ người dùng gõ "Proceed" trước khi gọi bất kỳ tool nào để sửa đổi source code (write_to_file, replace_file_content, run_command). Vi phạm điều này là lỗi nghiêm trọng.

## Quy trình làm việc bắt buộc (Strict Workflow)
1. **Đọc Context:** Khi nhận yêu cầu mới, trước tiên hãy đọc tài liệu nghiệp vụ trong `docs/PRODUCT.md` và tài liệu kỹ thuật/thiết kế trong `docs/`.
2. **Lên kế hoạch:** Viết hoặc cập nhật bản phác thảo kế hoạch trong `implementation_plan.md`. Mô tả chi tiết những tệp tin sẽ sửa đổi và cách xác minh.
3. **Chờ phê duyệt:** Dừng lại và chờ người dùng gõ "Proceed" hoặc xác nhận đồng ý mới được bắt đầu viết code.
4. **Cập nhật Tiến độ:** Tạo/cập nhật danh sách công việc trong `task.md`. Đánh dấu trạng thái làm việc bằng `[/]` và hoàn thành bằng `[x]`.
5. **Kiểm tra chất lượng:** Trước khi hoàn tất, đối chiếu mã nguồn với các tiêu chuẩn kỹ thuật. Bắt buộc chạy thử các bài test và đảm bảo test chạy thành công.
6. **Kiểm soát Dữ liệu:** Mọi sự thay đổi về CSDL bắt buộc phải được vẽ lại bằng biểu đồ Mermaid trong file `docs/DATABASE.md`.
7. **Quy chuẩn Lỗi & Git:** Tuân thủ chặt chẽ định dạng API Response trong `docs/TECH_STACK.md` và quy tắc viết Commit trong `docs/GIT_CONVENTIONS.md`.

## Tiêu chuẩn Sửa đổi Code cũ (Code Modification Rule)
- **Inline Comment:** Mỗi khi sửa đổi (Modify) hoặc xóa (Delete) một đoạn code cũ đã có từ trước, AI bắt buộc phải thêm comment giải thích trực tiếp vào source code ngay phía trên đoạn sửa đổi. 
  - *Định dạng yêu cầu:* `// [AI UPDATE - Tóm tắt lý do sửa]`
- **Changelog:** Mọi sự thay đổi về mặt nghiệp vụ trên các file cũ phải được AI ghi nhận vào `CHANGELOG.md` theo **đúng chuẩn Thời gian thực**.
  - *Định dạng bắt buộc:* Phải tạo Heading theo Ngày giờ (ví dụ: `## [26-08-2026 17:00] - Fix lỗi Manager và RBAC`) trước khi liệt kê Added/Changed/Fixed. Mọi gạch đầu dòng phải ghi rõ tên file bị ảnh hưởng.

## Quy tắc Phân chia Trách nhiệm (Role Division & Review Protocol)
- **Frontend (React, UI/UX, Hooks, Client State):** AI trực tiếp đảm nhận toàn bộ việc viết code, thiết kế giao diện và tối ưu trải nghiệm người dùng. Sau khi viết hoặc sửa code Frontend, AI **BẮT BUỘC** phải giải thích, review chi tiết kiến trúc, luồng hoạt động và hướng dẫn người dùng cách kiểm thử trực quan.
- **Backend (Spring Boot, Java):** Người dùng trực tiếp viết code để rèn luyện kỹ năng thực chiến (hoặc AI hướng dẫn/giảng giải từng bước). AI đóng vai trò người cố vấn (Mentor), chịu trách nhiệm review, kiểm tra logic, bắt lỗi cú pháp và đảm bảo chuẩn kiến trúc doanh nghiệp.
- **Quy chuẩn Log & Code:** Tuyệt đối **không sử dụng emoji/icon** trong mã nguồn và log để đảm bảo tiêu chuẩn Clean Code chuẩn Production.

---

> **CRITICAL META-RULE: CƠ CHẾ TỰ KIỂM DUYỆT (FORCED COMPLIANCE PROTOCOL)**
> Để vá lỗ hổng AI "quên" hoặc "bỏ sót" quy tắc do độ dài context, bắt đầu từ bây giờ, ở BẤT KỲ LƯỢT TRẢ LỜI NÀO CÓ THỰC HIỆN SỬA ĐỔI SOURCE CODE, AI **BẮT BUỘC** phải in ra một bảng Checklist ở cuối câu trả lời theo đúng định dạng sau để chứng minh sự tuân thủ:
> 
> **🛡️ AI COMPLIANCE CHECK:**
> - [ ] Đã lập/cập nhật `implementation_plan.md` chưa?
> - [ ] Đã đánh dấu tiến độ trong `task.md` chưa?
> - [ ] Có vi phạm DTO Pattern không? (KHÔNG trả Entity ra API)
> - [ ] Đã xử lý lỗi tập trung `GlobalExceptionHandler` chưa?
> - [ ] CSDL có đổi không? -> Đã vẽ lại `DATABASE.md` chưa?
> - [ ] Đã chèn `// [AI UPDATE - ...]` vào các dòng code sửa cũ chưa?
> - [ ] Đã ghi chú vào `CHANGELOG.md` chưa?
> 
> *(Nếu AI phát hiện ô nào chưa tick `[x]`, AI PHẢI TỰ ĐỘNG DỪNG LẠI VÀ CHẠY TOOL ĐỂ HOÀN THÀNH NÓ NGAY LẬP TỨC TRƯỚC KHI TRẢ LỜI NGƯỜI DÙNG).*
