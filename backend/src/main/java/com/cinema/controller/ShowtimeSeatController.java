package com.cinema.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cinema.dto.ShowtimeSeatLayoutDto;
import com.cinema.entity.BookingSeat;
import com.cinema.entity.Seat;
import com.cinema.entity.SeatStatus;
import com.cinema.entity.Showtime;
import com.cinema.repository.BookingSeatRepository;
import com.cinema.repository.SeatRepository;
import com.cinema.repository.ShowtimeRepository;
import com.cinema.service.SeatLockService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * [AI UPDATE - Controller cung cap API lay so do ghe kem trang thai thuc te cho Suat chieu]
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/showtimes")
@RequiredArgsConstructor
public class ShowtimeSeatController {

    private final ShowtimeRepository showtimeRepository;
    private final SeatRepository seatRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final SeatLockService seatLockService;

    @GetMapping("/{showtimeId}/seat-layout")
    public ResponseEntity<List<ShowtimeSeatLayoutDto>> getShowtimeSeatLayout(@PathVariable Long showtimeId) {
        // 1. Tim suat chieu
        Showtime showtime = showtimeRepository.findById(showtimeId)
                .orElseThrow(() -> new IllegalArgumentException("Showtime not found: " + showtimeId));

        Long roomId = showtime.getRoom().getId();
        double basePrice = showtime.getPrice();

        // 2. Lay tat ca ghe vat ly con active trong phong chieu
        List<Seat> physicalSeats = seatRepository.findByRoomId(roomId).stream()
                .filter(Seat::isActive)
                .toList();

        // 3. Lay danh sach ID cac ghe da ban (BOOKED tu PostgreSQL)
        Set<Long> bookedSeatIds = bookingSeatRepository.findByBookingShowtimeId(showtimeId).stream()
                .map(bs -> bs.getSeat().getId())
                .collect(Collectors.toSet());

        // 4. Lay danh sach ID cac ghe dang giu (HOLDING tu Redis)
        Set<Long> holdingSeatIds = seatLockService.getLockedSeatIds(showtimeId);

        // 5. Ket hop du lieu de tinh toan trang thai thuc te cua tung ghe
        List<ShowtimeSeatLayoutDto> layout = new ArrayList<>();
        for (Seat seat : physicalSeats) {
            double finalPrice = basePrice * (seat.getPriceMultiplier() > 0 ? seat.getPriceMultiplier() : 1.0);
            SeatStatus status = SeatStatus.AVAILABLE;
            Long heldByUserId = null;
            Long remainingSeconds = null;

            if (bookedSeatIds.contains(seat.getId())) {
                status = SeatStatus.BOOKED;
            } else if (holdingSeatIds.contains(seat.getId())) {
                status = SeatStatus.HOLDING;
                heldByUserId = seatLockService.getLockedUserId(showtimeId, seat.getId());
                remainingSeconds = seatLockService.getRemainingHoldSeconds(showtimeId, seat.getId());
            }

            layout.add(ShowtimeSeatLayoutDto.builder()
                    .seatId(seat.getId())
                    .seatRow(seat.getSeatRow())
                    .seatColumn(seat.getSeatColumn())
                    .seatName(seat.getSeatName())
                    .type(seat.getType())
                    .price(finalPrice)
                    .status(status)
                    .heldByUserId(heldByUserId)
                    .holdRemainingSeconds(remainingSeconds)
                    .build());
        }

        log.info("[SHOWTIME_SEAT_LAYOUT] showtimeId={} roomId={} totalSeats={} booked={} holding={}",
                showtimeId, roomId, physicalSeats.size(), bookedSeatIds.size(), holdingSeatIds.size());

        return ResponseEntity.ok(layout);
    }
}