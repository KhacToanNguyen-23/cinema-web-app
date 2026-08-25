package com.cinema.service;
import com.cinema.dto.MovieDto;
import java.util.List;

public interface MovieService {
    List<MovieDto> getAllMovies();
    MovieDto getMovieById(Long id);
    MovieDto createMovie(MovieDto movieDto);
    MovieDto updateMovie(Long id, MovieDto movieDto);
    void deleteMovie(Long id);
}
