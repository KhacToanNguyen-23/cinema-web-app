package com.cinema.dto;

import com.cinema.entity.SeatStatus;
import com.cinema.entity.SeatType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * [AI UPDATE - DTO tra ve so do ghe kem trang thai thuc te cho tung suat chieu]
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShowtimeSeatLayoutDto {
    private Long seatId;
    private String seatRow;
    private int seatColumn;
    private String seatName;
    private SeatType type;
    private double price;
    private SeatStatus status; // AVAILABLE, HOLDING, BOOKED
    private Long heldByUserId;
    private Long holdRemainingSeconds;
}