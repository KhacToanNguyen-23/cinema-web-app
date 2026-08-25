package com.cinema.dto;

import lombok.Data;

@Data
public class CinemaDto {
    private Long id;
    private String name;
    private String address;
    private String phoneNumber;
    private RegionDto region;
    private boolean isActive;
}
