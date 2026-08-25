package com.cinema.service.impl;
import com.cinema.dto.MovieDto;
import com.cinema.mapper.MovieMapper;
import com.cinema.repository.MovieRepository;
import com.cinema.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import com.cinema.entity.Movie;

@Service
@RequiredArgsConstructor
public class MovieServiceImpl implements MovieService {
    
    private final MovieRepository movieRepository;
    private final MovieMapper movieMapper;

    @Override
    public List<MovieDto> getAllMovies() {
        return movieRepository.findAll()
                .stream()
                .filter(Movie::isActive) // Lọc soft delete
                .map(movieMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public MovieDto getMovieById(Long id) {
        return movieRepository.findById(id)
        .filter(Movie::isActive)
        .map(movieMapper::toDto)
        .orElse(null);   
    }

    @Override
    public MovieDto createMovie(MovieDto movieDto) {
        Movie movie = movieMapper.toEntity(movieDto);
        movie.setActive(true); // Đảm bảo active khi tạo
        return movieMapper.toDto(movieRepository.save(movie));
    }

    @Override
    public MovieDto updateMovie(Long id, MovieDto movieDto) {
        return movieRepository.findById(id)
                .filter(Movie::isActive)
                .map(existingMovie -> {
                    existingMovie.setTitle(movieDto.getTitle());
                    existingMovie.setDescription(movieDto.getDescription());
                    existingMovie.setReleaseDate(movieDto.getReleaseDate());
                    existingMovie.setDuration(movieDto.getDuration());
                    existingMovie.setPosterUrl(movieDto.getPosterUrl());
                    existingMovie.setTrailerUrl(movieDto.getTrailerUrl());
                    existingMovie.setDirector(movieDto.getDirector());
                    existingMovie.setCast(movieDto.getCast());
                    existingMovie.setAgeLimit(movieDto.getAgeLimit());
                    
                    return movieMapper.toDto(movieRepository.save(existingMovie));
                })
                .orElseThrow(() -> new RuntimeException("Movie not found or inactive"));
    }

    @Override
    public void deleteMovie(Long id) {
        movieRepository.findById(id)
                .ifPresent(movie -> {
                    movie.setActive(false);
                    movieRepository.save(movie);
                });
    }
}