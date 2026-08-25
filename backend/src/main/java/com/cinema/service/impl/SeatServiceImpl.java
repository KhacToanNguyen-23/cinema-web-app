package com.cinema.service.impl;
import com.cinema.entity.Seat;
import com.cinema.repository.SeatRepository;
import com.cinema.repository.RoomRepository;
import com.cinema.service.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SeatServiceImpl implements SeatService {
    private final SeatRepository seatRepository;
    private final RoomRepository roomRepository;

    @Override
    public Seat createSeat(Seat seat) {
        if (seat.getRoom() == null || seat.getRoom().getId() <= 0) throw new IllegalArgumentException("Room required");
        com.cinema.entity.Room room = roomRepository.findById(seat.getRoom().getId()).orElseThrow(() -> new IllegalArgumentException("Room not found"));
        seat.setRoom(room);
        seat.setActive(true);
        return seatRepository.save(seat);
    }
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
    public List<Seat> getAllSeats() { return seatRepository.findAll().stream().filter(Seat::isActive).toList(); }
    @Override
    public List<Seat> getSeatsByRoomId(Long roomId) { return seatRepository.findByRoomId(roomId).stream().filter(Seat::isActive).toList(); }
}
