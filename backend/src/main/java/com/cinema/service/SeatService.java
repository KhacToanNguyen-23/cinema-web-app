package com.cinema.service;
import java.util.List;
import com.cinema.entity.Seat;
public interface SeatService {
    Seat createSeat(Seat seat);
    Seat updateSeat(Long id, Seat seat);
    void deleteSeat(Long id);
    List<Seat> getAllSeats();
    List<Seat> getSeatsByRoomId(Long roomId);
}
