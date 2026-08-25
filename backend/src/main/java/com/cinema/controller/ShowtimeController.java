package com.cinema.controller;

import com.cinema.dto.ShowtimeDto;
import com.cinema.mapper.ShowtimeMapper;
import com.cinema.entity.Showtime;
import com.cinema.service.ShowtimeService;
import com.cinema.repository.MovieRepository;
import com.cinema.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/showtimes")
@RequiredArgsConstructor
public class ShowtimeController {
    
    private final ShowtimeService showtimeService;
    private final ShowtimeMapper showtimeMapper;
    private final MovieRepository movieRepository;
    private final RoomRepository roomRepository;

    @GetMapping
    public ResponseEntity<List<ShowtimeDto>> getAllShowtimes() {
        return ResponseEntity.ok(showtimeService.getAllShowtimes().stream().map(showtimeMapper::toDto).collect(Collectors.toList()));
    }

    @PostMapping
    public ResponseEntity<ShowtimeDto> createShowtime(@RequestBody ShowtimeDto dto) {
        Showtime entity = new Showtime();
        entity.setStartTime(dto.getStartTime());
        entity.setEndTime(dto.getEndTime());
        entity.setPrice(dto.getPrice());
        entity.setMovie(movieRepository.findById(dto.getMovieId()).orElseThrow());
        entity.setRoom(roomRepository.findById(dto.getRoomId()).orElseThrow());
        
        return ResponseEntity.ok(showtimeMapper.toDto(showtimeService.createShowtime(entity)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ShowtimeDto> updateShowtime(@PathVariable Long id, @RequestBody ShowtimeDto dto) {
        Showtime entity = new Showtime();
        entity.setStartTime(dto.getStartTime());
        entity.setEndTime(dto.getEndTime());
        entity.setPrice(dto.getPrice());
        if (dto.getMovieId() != null) entity.setMovie(movieRepository.findById(dto.getMovieId()).orElseThrow());
        if (dto.getRoomId() != null) entity.setRoom(roomRepository.findById(dto.getRoomId()).orElseThrow());
        
        return ResponseEntity.ok(showtimeMapper.toDto(showtimeService.updateShowtime(id, entity)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShowtime(@PathVariable Long id) {
        showtimeService.deleteShowtime(id);
        return ResponseEntity.noContent().build();
    }
}
