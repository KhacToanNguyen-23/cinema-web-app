package com.cinema.mapper;
import com.cinema.dto.MovieDto;
import com.cinema.entity.Movie;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MovieMapper {
    MovieDto toDto(Movie movie);
    Movie toEntity(MovieDto dto);
}
