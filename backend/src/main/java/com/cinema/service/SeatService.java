package com.cinema.service;
import java.util.List;

import com.cinema.dto.SeatDto;
import com.cinema.entity.Seat;
public interface SeatService {
    List<SeatDto> createListSeatDtos(List<SeatDto> seatDtos);
    Seat updateSeat(Long id, Seat seat);
    void deleteSeat(Long id);
    List<Seat> getAllSeats();
    List<Seat> getSeatsByRoomId(Long roomId);
}
