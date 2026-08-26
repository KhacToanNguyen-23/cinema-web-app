package com.cinema.service;

import com.cinema.dto.MovieDto;
import com.cinema.entity.MovieStatus;
import java.util.List;

public interface MovieService {
    List<MovieDto> getAllMovies(MovieStatus status);
    MovieDto getMovieById(Long id);
    MovieDto createMovie(MovieDto movieDto);
    MovieDto updateMovie(Long id, MovieDto movieDto);
    void deleteMovie(Long id);

    // [AI UPDATE - Xóa overrideStatus: updateMovie đã xử lý manualStatusOverride khi admin truyền status vào]

    void refreshMovieStatus(Long movieId);
    void refreshAllMovieStatuses();
}
