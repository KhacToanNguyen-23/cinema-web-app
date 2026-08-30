package com.cinema.service.impl;

import com.cinema.dto.SeatDto;
import com.cinema.entity.Room;
import com.cinema.entity.Seat;
import com.cinema.mapper.SeatMapper;
import com.cinema.mapper.SeatMapperImpl;
import com.cinema.repository.SeatRepository;
import com.cinema.repository.RoomRepository;
import com.cinema.service.SeatService;

import jakarta.el.ELException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SeatServiceImpl implements SeatService {
    private final SeatRepository seatRepository;
    private final RoomRepository roomRepository;
    private final SeatMapper seatMapper;

    @Override
    public Seat updateSeat(Long id, Seat seat) {
        Seat existing = seatRepository.findById(id).orElseThrow();
        if (seat.getRoom() != null && seat.getRoom().getId() > 0) {
            existing.setRoom(roomRepository.findById(seat.getRoom().getId()).orElseThrow());
        }
        existing.setSeatRow(seat.getSeatRow());
        existing.setSeatColumn(seat.getSeatColumn());
        existing.setType(seat.getType());
        existing.setPriceMultiplier(seat.getPriceMultiplier());
        return seatRepository.save(existing);
    }

    @Override
    public void deleteSeat(Long id) {
        Seat existing = seatRepository.findById(id).orElseThrow();
        existing.setActive(false);
        seatRepository.save(existing);
    }

    @Override
    public List<Seat> getAllSeats() {
        return seatRepository.findAll().stream().filter(Seat::isActive).toList();
    }

    @Override
    public List<Seat> getSeatsByRoomId(Long roomId) {
        return seatRepository.findByRoomId(roomId).stream().filter(Seat::isActive).toList();
    }

    @Override
    public List<SeatDto> createListSeatDtos(List<SeatDto> seatDtos) {
        if (seatDtos == null || seatDtos.isEmpty()) {
            throw new IllegalArgumentException("Danh sách ghế không được để trống");
        }

        Long roomId = seatDtos.get(0).getRoom() != null ? seatDtos.get(0).getRoom().getId() : null;
        if (roomId == null) {
            throw new IllegalArgumentException("Room ID không hợp lệ");
        }

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phòng chiếu với ID: " + roomId));

        List<Seat> seatsToSave = new ArrayList<>();
        for (SeatDto dto : seatDtos) {
            boolean exists = seatRepository.existsByRoomIdAndSeatRowAndSeatColumn(
                    room.getId(), dto.getSeatRow(), dto.getSeatColumn());
            if (exists) {
                throw new IllegalArgumentException(
                        "Ghế " + dto.getSeatRow() + dto.getSeatColumn() + " đã tồn tại trong phòng này!");
            }
            Seat seat = seatMapper.toEntity(dto);
            seat.setRoom(room);
            seat.setActive(true);
            seatsToSave.add(seat);
        }
        List<Seat> savedSeats = seatRepository.saveAll(seatsToSave);

        // [AI UPDATE - Cập nhật capacity của room dựa trên tổng số ghế active thực tế trong database]
        int totalActiveSeats = seatRepository.findByRoomId(room.getId()).stream().filter(Seat::isActive).toList().size();
        room.setCapacity(totalActiveSeats);
        roomRepository.save(room);

        // 4. Trả về DTO đã có ID sinh ra từ DB
        return savedSeats.stream()
                .map(seatMapper::toDto)
                .toList();
    }
}
