package com.cinema.dto;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ShowtimeDto {
    private Long id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Long movieId;
    private Long roomId;
    private double price;
    private boolean isActive;
}
