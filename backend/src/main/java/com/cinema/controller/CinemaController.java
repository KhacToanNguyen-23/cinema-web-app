package com.cinema.controller;

import com.cinema.dto.CinemaDto;
import com.cinema.mapper.CinemaMapper;
import com.cinema.service.CinemaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/cinemas")
@RequiredArgsConstructor
public class CinemaController {

    private final CinemaService cinemaService;
    private final CinemaMapper cinemaMapper;

    @GetMapping
    public ResponseEntity<List<CinemaDto>> getAllCinemas() {
        List<CinemaDto> cinemas = cinemaService.getAllCinemas()
                .stream()
                .map(cinemaMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(cinemas);
    }

    @PostMapping
    public ResponseEntity<CinemaDto> createCinema(@RequestBody CinemaDto cinemaDto) {
        return ResponseEntity.ok(
            cinemaMapper.toDto(cinemaService.createCinema(cinemaMapper.toEntity(cinemaDto)))
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<CinemaDto> updateCinema(@PathVariable Long id, @RequestBody CinemaDto cinemaDto) {
        return ResponseEntity.ok(
            cinemaMapper.toDto(cinemaService.updateCinema(id, cinemaMapper.toEntity(cinemaDto)))
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCinema(@PathVariable Long id) {
        cinemaService.deleteCinema(id);
        return ResponseEntity.noContent().build();
    }
}
