package com.cinema.dto;

import com.cinema.entity.SeatStatus;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * [AI UPDATE - Gói tin WebSocket trao đổi trạng thái ghế giữa Client và Server]
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatMessageDto {
    private Long showtimeId;    // 1. Suất chiếu đang chọn
    private Long seatId;        // 2. ID ghế trong Database
    private String seatName;    // 3. Tên ghế hiển thị (Ví dụ: "A1", "H8")
    private Long userId;        // 4. ID người thực hiện hành động
    private SeatStatus status;  // 5. Trạng thái ghế theo enum Type-Safe: AVAILABLE, HOLDING, BOOKED, MAINTENANCE
}



