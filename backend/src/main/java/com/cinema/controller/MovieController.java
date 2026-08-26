package com.cinema.controller;

import com.cinema.dto.MovieDto;
import com.cinema.entity.MovieStatus;
import com.cinema.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/movies")
public class MovieController {

    @Autowired
    private MovieService movieService;

    @GetMapping
    public ResponseEntity<List<MovieDto>> getAllMovies(@RequestParam(required = false) MovieStatus status) {
        return ResponseEntity.ok(movieService.getAllMovies(status));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<MovieDto> getMovieById(@PathVariable Long id) {
        MovieDto movie = movieService.getMovieById(id);
        return movie != null ? ResponseEntity.ok(movie) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<MovieDto> createMovie(@RequestBody MovieDto movieDto) {
        return ResponseEntity.ok(movieService.createMovie(movieDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MovieDto> updateMovie(@PathVariable Long id, @RequestBody MovieDto movieDto) {
        MovieDto updatedMovie = movieService.updateMovie(id, movieDto);
        return ResponseEntity.ok(updatedMovie);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
        return ResponseEntity.noContent().build();
    }

    // [AI UPDATE - Xóa endpoint PATCH /{id}/status (overrideStatus): thừa vì PUT /{id} đã xử lý manualStatusOverride]
}
