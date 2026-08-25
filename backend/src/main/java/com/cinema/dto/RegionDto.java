package com.cinema.dto;

import lombok.Data;

@Data
public class RegionDto {
    private Long id;
    private String name;
    private String code;
    private boolean isActive;
}
