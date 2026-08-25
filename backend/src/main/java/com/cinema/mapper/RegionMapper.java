package com.cinema.mapper;

import com.cinema.dto.RegionDto;
import com.cinema.entity.Region;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface RegionMapper {
    RegionMapper INSTANCE = Mappers.getMapper(RegionMapper.class);

    RegionDto toDto(Region region);
    Region toEntity(RegionDto regionDto);
}
