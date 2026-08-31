package com.cinema.dto;

import lombok.Data;

@Data
public class RoomDto {
    private long id;
    private String name;
    private CinemaDto cinema;
    private int capacity;
    // [AI UPDATE - Chuyen doi roomType sang kieu Enum RoomType type-safe]
    private com.cinema.entity.RoomType roomType;
    private boolean isActive;
}
