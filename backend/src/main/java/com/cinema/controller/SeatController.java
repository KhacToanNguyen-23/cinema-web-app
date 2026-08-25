package com.cinema.controller;
import com.cinema.dto.SeatDto;
import com.cinema.mapper.SeatMapper;
import com.cinema.service.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/seats")
@RequiredArgsConstructor
public class SeatController {
    private final SeatService seatService;
    private final SeatMapper seatMapper;

    @GetMapping
    public ResponseEntity<List<SeatDto>> getAllSeats() {
        return ResponseEntity.ok(seatService.getAllSeats().stream().map(seatMapper::toDto).collect(Collectors.toList()));
    }
    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<SeatDto>> getSeatsByRoom(@PathVariable Long roomId) {
        return ResponseEntity.ok(seatService.getSeatsByRoomId(roomId).stream().map(seatMapper::toDto).collect(Collectors.toList()));
    }
    @PostMapping
    public ResponseEntity<SeatDto> createSeat(@RequestBody SeatDto dto) {
        return ResponseEntity.ok(seatMapper.toDto(seatService.createSeat(seatMapper.toEntity(dto))));
    }
    @PutMapping("/{id}")
    public ResponseEntity<SeatDto> updateSeat(@PathVariable Long id, @RequestBody SeatDto dto) {
        return ResponseEntity.ok(seatMapper.toDto(seatService.updateSeat(id, seatMapper.toEntity(dto))));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSeat(@PathVariable Long id) {
        seatService.deleteSeat(id);
        return ResponseEntity.noContent().build();
    }
}
