# Cấu trúc Cơ sở dữ liệu (Database Schema)

> **QUY TẮC BẮT BUỘC CHO AI:** 
> 1. Luôn đọc file này trước khi viết các câu lệnh SQL hoặc tạo Entity.
> 2. Mỗi khi có sự thay đổi về cấu trúc bảng (thêm/sửa/xóa bảng hoặc cột), AI **BẮT BUỘC** phải cập nhật lại biểu đồ Mermaid dưới đây.

## Sơ đồ Thực thể (Entity Relationship Diagram)
```mermaid
erDiagram
    USERS {
        Long id PK
        String username
        String role
    }
    CINEMAS {
        Long id PK
        String name
        String address
        String phone_number
        Boolean is_active
    }
    ROOMS {
        Long id PK
        String name
        RoomType room_type
        Int capacity
        Boolean is_active
        Long cinema_id FK
    }
    SEATS {
        Long id PK
        String seat_row
        Int seat_column
        String type
        Double price_multiplier
        Boolean is_active
        Long room_id FK
    }
    MOVIES {
        Long id PK
        String title
        Int duration
        String age_limit
        String status
        Boolean is_active
    }
    SHOWTIMES {
        Long id PK
        LocalDateTime start_time
        LocalDateTime end_time
        Double price
        ShowtimeFormat format
        Boolean is_active
        Long movie_id FK
        Long room_id FK
    }
    
    USERS }|--o| CINEMAS : "Manages"
    CINEMAS ||--o{ ROOMS : "has"
    ROOMS ||--o{ SEATS : "contains"
    MOVIES ||--o{ SHOWTIMES : "screens"
    ROOMS ||--o{ SHOWTIMES : "hosts"
```
