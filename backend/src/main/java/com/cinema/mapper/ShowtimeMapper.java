package com.cinema.mapper;
import com.cinema.dto.ShowtimeDto;
import com.cinema.entity.Showtime;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {MovieMapper.class, RoomMapper.class})
public interface ShowtimeMapper {
    @Mapping(source = "movie.id", target = "movieId")
    @Mapping(source = "room.id", target = "roomId")
    @Mapping(source = "movie", target = "movie")
    @Mapping(source = "room", target = "room")
    ShowtimeDto toDto(Showtime showtime);
}
