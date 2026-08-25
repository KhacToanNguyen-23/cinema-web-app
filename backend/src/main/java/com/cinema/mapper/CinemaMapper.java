package com.cinema.mapper;

import com.cinema.dto.CinemaDto;
import com.cinema.entity.Cinema;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", uses = {RegionMapper.class})
public interface CinemaMapper {
    CinemaMapper INSTANCE = Mappers.getMapper(CinemaMapper.class);

    CinemaDto toDto(Cinema cinema);
    Cinema toEntity(CinemaDto cinemaDto);
}
