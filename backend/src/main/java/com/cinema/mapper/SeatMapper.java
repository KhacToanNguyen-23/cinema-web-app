package com.cinema.mapper;
import com.cinema.dto.SeatDto;
import com.cinema.entity.Seat;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", uses = {RoomMapper.class})
public interface SeatMapper {
    SeatMapper INSTANCE = Mappers.getMapper(SeatMapper.class);
    SeatDto toDto(Seat seat);
    Seat toEntity(SeatDto seatDto);
}
