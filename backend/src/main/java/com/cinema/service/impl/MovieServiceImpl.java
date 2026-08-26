package com.cinema.service.impl;

import com.cinema.dto.MovieDto;
import com.cinema.entity.Movie;
import com.cinema.entity.MovieStatus;
import com.cinema.mapper.MovieMapper;
import com.cinema.repository.MovieRepository;
import com.cinema.repository.ShowtimeRepository;
import com.cinema.service.MovieService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Scheduled;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MovieServiceImpl implements MovieService {

    private final MovieRepository movieRepository;
    private final MovieMapper movieMapper;
    private final ShowtimeRepository showtimeRepository;

    // -------------------------------------------------------------------------
    // CRUD
    // -------------------------------------------------------------------------

    @Override
    public List<MovieDto> getAllMovies(MovieStatus status) {
        // Query trực tiếp dưới DB bằng SQL (WHERE isActive = true AND status = ...)
        List<Movie> movies;
        if (status == null) {
            movies = movieRepository.findByIsActiveTrue();
        } else {
            movies = movieRepository.findByIsActiveTrueAndStatus(status);
        }

        return movies.stream()
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
        movie.setActive(true);
        // [AI UPDATE - Phim mới luôn bắt đầu là COMING_SOON.
        //  Admin muốn override status thì truyền field status vào PUT /api/v1/movies/{id}.
        //  Gán manualStatusOverride=false để scheduled job tự cập nhật status theo thời gian.]
        movie.setStatus(MovieStatus.COMING_SOON);
        movie.setManualStatusOverride(false);

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
                    existingMovie.setGenre(movieDto.getGenre());

                    // Neu admin truyen status vao → manual override
                    if (movieDto.getStatus() != null) {
                        existingMovie.setStatus(movieDto.getStatus());
                        existingMovie.setManualStatusOverride(true);
                    } else {
                        // Neu khong truyen → reset ve auto (tinh lai tu releaseDate)
                        existingMovie.setManualStatusOverride(false);
                        existingMovie.setStatus(computeStatus(existingMovie));
                    }

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



    // -------------------------------------------------------------------------
    // Core Logic: tinh status dua tren releaseDate + Showtime
    // -------------------------------------------------------------------------

    /**
     * Quy tac tu dong tinh status:
     *   1. releaseDate null hoac con trong tuong lai         → COMING_SOON
     *   2. releaseDate da den + con showtime tuong lai       → NOW_SHOWING
     *   3. releaseDate da den + khong con showtime nao       → ENDED
     */
    private MovieStatus computeStatus(Movie movie) {
        LocalDateTime now = LocalDateTime.now();

        // Chua co ngay phat hanh, hoac ngay phat hanh con trong tuong lai
        if (movie.getReleaseDate() == null || movie.getReleaseDate().isAfter(now)) {
            return MovieStatus.COMING_SOON;
        }

        // Da phat hanh → kiem tra co suất chieu tuong lai khong
        boolean hasFutureShowtime = (movie.getId() != null)
                && showtimeRepository.existsByMovieIdAndStartTimeAfter(movie.getId(), now);

        if (hasFutureShowtime) {
            return MovieStatus.NOW_SHOWING;
        }

        // Da phat hanh nhung khong con suat chieu nao
        return MovieStatus.ENDED;
    }

    @Override
    public void refreshMovieStatus(Long movieId) {
        movieRepository.findById(movieId).ifPresent(movie -> {
            if (!movie.getManualStatusOverride() && movie.isActive()) {
                MovieStatus newStatus = computeStatus(movie);
                if (movie.getStatus() != newStatus) {
                    movie.setStatus(newStatus);
                    movieRepository.save(movie);
                    log.info("Movie [{}] status auto-updated to {}", movie.getTitle(), newStatus);
                }
            }
        });
    }

    @Scheduled(cron = "0 0 * * * *") // Chạy mỗi đầu giờ (vd: 00:00, 01:00...)
    @Override
    public void refreshAllMovieStatuses() {
        log.info("Running scheduled job to refresh all movie statuses...");
        List<Movie> activeMovies = movieRepository.findByIsActiveTrue();
        for (Movie movie : activeMovies) {
            if (!movie.getManualStatusOverride()) {
                MovieStatus newStatus = computeStatus(movie);
                if (movie.getStatus() != newStatus) {
                    movie.setStatus(newStatus);
                    movieRepository.save(movie);
                    log.info("Movie [{}] status auto-updated to {}", movie.getTitle(), newStatus);
                }
            }
        }
        log.info("Finished refreshing movie statuses.");
    }
}