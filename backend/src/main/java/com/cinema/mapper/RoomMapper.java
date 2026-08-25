package com.cinema.mapper;

import com.cinema.dto.RoomDto;
import com.cinema.entity.Room;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", uses = {CinemaMapper.class})
public interface RoomMapper {
    RoomMapper INSTANCE = Mappers.getMapper(RoomMapper.class);

    RoomDto toDto(Room room);
    Room toEntity(RoomDto roomDto);
}
