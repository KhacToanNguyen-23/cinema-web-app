package com.cinema.controller;

import com.cinema.dto.ShowtimeDto;
import com.cinema.entity.Showtime;
import com.cinema.mapper.ShowtimeMapper;
import com.cinema.repository.MovieRepository;
import com.cinema.repository.RoomRepository;
import com.cinema.service.ShowtimeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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

    // [AI UPDATE - Them RequestParam cinemaId de loc du lieu cho Manager]
    @GetMapping
    public ResponseEntity<List<ShowtimeDto>> getAllShowtimes(@RequestParam(required = false) Long cinemaId) {
        List<Showtime> showtimes;
        if (cinemaId != null) {
            showtimes = showtimeService.getShowtimesByCinemaId(cinemaId);
        } else {
            showtimes = showtimeService.getAllShowtimes();
        }
        return ResponseEntity.ok(showtimes.stream().map(showtimeMapper::toDto).collect(Collectors.toList()));
    }

    // [AI UPDATE - Bo sung endpoint lay chi tiet mot suat chieu theo ID]
    @GetMapping("/{id}")
    public ResponseEntity<ShowtimeDto> getShowtimeById(@PathVariable Long id) {
        Showtime showtime = showtimeService.getShowtimeById(id);
        if (showtime == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(showtimeMapper.toDto(showtime));
    }

    // [AI UPDATE - Gop chung POST /api/v1/showtimes nhan List<ShowtimeDto> cho ca tao don le lan hang loat]
    @PostMapping
    public ResponseEntity<List<ShowtimeDto>> createShowtimes(@RequestBody List<ShowtimeDto> dtos) {
        List<ShowtimeDto> created = showtimeService.createShowtimes(dtos);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ShowtimeDto> updateShowtime(@PathVariable Long id, @RequestBody ShowtimeDto dto) {
        Showtime entity = new Showtime();
        entity.setStartTime(dto.getStartTime());
        entity.setEndTime(dto.getEndTime());
        entity.setPrice(dto.getPrice());
        if (dto.getFormat() != null) entity.setFormat(dto.getFormat());
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
