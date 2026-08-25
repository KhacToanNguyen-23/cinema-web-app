# Tài liệu Quy chuẩn Kỹ thuật (Technical Guidelines) - Cinema Web App

## 1. Công nghệ sử dụng (Tech Stack)
- **Backend:** Java 17, Spring Boot 3.3.0
- **Database:** PostgreSQL 17 (Cổng: 5433, DB: cinemadb)
- **Thư viện Backend:** Lombok, Spring Data JPA, MapStruct (Bản 1.5.5.Final)
- **Frontend:** React, Vite, Tailwind CSS v4
- **Thư viện Frontend:** Axios, React Router Dom

## 2. Tiêu chuẩn Kiến trúc Frontend (BẮT BUỘC ĐỐI VỚI AI)
Khi làm việc với Frontend, tuyệt đối tuân thủ cấu trúc thư mục sau:
- `api/`: Chứa file `axiosClient.js` (gắn Token) và các file gọi API riêng biệt (VD: `movieApi.js`). Không được gọi Axios trực tiếp trong Page.
- `components/`:
  - `common/`: Chứa các UI dùng chung (Button, Input, Modal...).
  - `feature/`: Chứa các Component đặc thù (MovieCard, SeatMap...).
- `layouts/`: Chứa khung giao diện (AdminLayout, ClientLayout). Các Page phải được bọc trong Layout.
- `pages/`: Tách riêng folder theo Actor (`admin/`, `client/`, `auth/`). Page KHÔNG chứa logic gọi API trực tiếp.
- `routes/`: Chứa logic phân quyền bảo vệ (`ProtectedRoute.jsx`) và định tuyến.
- `store/` hoặc `context/`: Nơi quản lý State toàn cục.

### Các Quy tắc UI/UX Đặc Thù:
- **Ngôn ngữ:** Thống nhất sử dụng tiếng Việt 100% trên toàn bộ giao diện (Frontend).
- **Mock Data:** TUYỆT ĐỐI KHÔNG dùng Mock Data (dữ liệu giả, hardcode) trên giao diện. Mọi dữ liệu (từ Hero banner, Slider, List phim, Lịch chiếu...) đều phải được fetch thực tế từ API (Backend). Nếu chưa có API, phải tạm ẩn phần UI đó đi chứ không được hardcode.

## 3. Tiêu chuẩn viết Code Backend (BẮT BUỘC ĐỐI VỚI AI)

### A. Quy tắc DTO & Entity Mapping
- **CẤM:** Tuyệt đối KHÔNG trả trực tiếp Entity từ Controller ra ngoài API (để tránh lỗi vòng lặp JSON và lộ thiết kế CSDL).
- **BẮT BUỘC:** Mọi dữ liệu giao tiếp với Frontend phải thông qua DTO (Data Transfer Object).
- **CÔNG CỤ:** Bắt buộc sử dụng `MapStruct` để tự động map qua lại giữa Entity và DTO. Mỗi Entity phải có một `[Tên]Mapper` dưới dạng interface gắn `@Mapper(componentModel = "spring")`.

### B. Quy tắc cấu trúc dữ liệu và Ràng buộc
- Khi khai báo Entity: Sử dụng các kiểu Wrapper Class cho ID (ví dụ: `Long id` thay vì `long id`).
- Khi định nghĩa quan hệ (`@ManyToOne`, `@OneToMany`): Không map bằng các cột ID nguyên thủy (ví dụ: `private Long userId`), mà bắt buộc phải map sang đối tượng tham chiếu (`private User user`).
- **Orphan Validation:** Khi thêm mới một thực thể con (VD: `Room`), bắt buộc phải kiểm tra thực thể cha (`Cinema`) có tồn tại không.

### C. Quy tắc Xóa mềm (Soft Delete)
- **CẤM:** Không dùng hàm `deleteById()` vật lý.
- **BẮT BUỘC:** Tất cả các thực thể nghiệp vụ (Region, Cinema, Room, Movie, Showtime, Seat) đều phải có trường `private boolean isActive;`. Lệnh xóa sẽ chuyển thành `isActive = false`.
- Các câu truy vấn `getAll()` mặc định phải lọc theo `isActive = true`.

### D. Tiêm phụ thuộc (Dependency Injection)
- **CẤM:** KHÔNG sử dụng `@Autowired` trên thuộc tính.
- **BẮT BUỘC:** Phải dùng Constructor Injection bằng cách thêm annotation `@RequiredArgsConstructor` (của Lombok) vào class Service/Controller và khai báo biến bằng `private final`.

## 4. Kiến trúc Package chuẩn
- `entity`: Nơi chứa bảng CSDL.
- `dto`: Nơi chứa Data Transfer Objects trả về Frontend.
- `mapper`: Chứa các Interface MapStruct.
- `repository`: Giao tiếp DB (Interface kế thừa `JpaRepository`).
- `service`: Chứa logic nghiệp vụ.
- `controller`: Chứa API Endpoints.
