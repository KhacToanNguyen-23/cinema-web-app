package com.cinema.dto;

import lombok.Data;

@Data
public class RoomDto {
    private long id;
    private String name;
    private CinemaDto cinema;
    private int capacity;
    private String roomType;
    private boolean isActive;
}
