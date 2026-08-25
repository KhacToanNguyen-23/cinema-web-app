package com.cinema.dto;
import com.cinema.entity.SeatType;
import lombok.Data;

@Data
public class SeatDto {
    private long id;
    private RoomDto room;
    private String seatRow;
    private int seatColumn;
    private SeatType type;
    private double priceMultiplier;
    private boolean isActive;
}
