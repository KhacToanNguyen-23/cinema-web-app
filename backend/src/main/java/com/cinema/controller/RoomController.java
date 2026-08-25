package com.cinema.controller;

import com.cinema.dto.RoomDto;
import com.cinema.mapper.RoomMapper;
import com.cinema.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;
    private final RoomMapper roomMapper;

    @GetMapping
    public ResponseEntity<List<RoomDto>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms().stream()
                .map(roomMapper::toDto).collect(Collectors.toList()));
    }

    @GetMapping("/cinema/{cinemaId}")
    public ResponseEntity<List<RoomDto>> getRoomsByCinema(@PathVariable Long cinemaId) {
        return ResponseEntity.ok(roomService.getRoomsByCinemaId(cinemaId).stream()
                .map(roomMapper::toDto).collect(Collectors.toList()));
    }

    @PostMapping
    public ResponseEntity<RoomDto> createRoom(@RequestBody RoomDto roomDto) {
        return ResponseEntity.ok(
            roomMapper.toDto(roomService.createRoom(roomMapper.toEntity(roomDto)))
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoomDto> updateRoom(@PathVariable Long id, @RequestBody RoomDto roomDto) {
        return ResponseEntity.ok(
            roomMapper.toDto(roomService.updateRoom(id, roomMapper.toEntity(roomDto)))
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }
}
