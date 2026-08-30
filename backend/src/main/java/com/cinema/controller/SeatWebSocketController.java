package com.cinema.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.cinema.dto.SeatMessageDto;
import com.cinema.entity.SeatStatus;
import com.cinema.service.SeatLockService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * [AI UPDATE - Controller tiep nhan va phat tin nhan WebSocket trang thai ghe ket hop Redis Lock]
 */
@Slf4j
@Controller
@RequiredArgsConstructor
public class SeatWebSocketController {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final SeatLockService seatLockService;

    /**
     * [Tiep nhan tu Client: /app/seat.select]
     */
    @MessageMapping("/seat.select")
    public void handleSeatSelection(@Payload SeatMessageDto message) {
        log.info("[WS_SEAT_ACTION] showtimeId={} seatId={} seatName={} status={} userId={}",
                message.getShowtimeId(), message.getSeatId(), message.getSeatName(), message.getStatus(), message.getUserId());

        String destination = "/topic/showtime/" + message.getShowtimeId();

        if (message.getStatus() == SeatStatus.HOLDING) {
            // 1. Thu khoa ghe trong Redis bang lenh SETNX + EX 300
            boolean lockAcquired = seatLockService.tryHoldSeat(
                    message.getShowtimeId(), message.getSeatId(), message.getUserId());

            if (lockAcquired) {
                // Khoa thanh cong -> Broadcast cho tat ca client
                simpMessagingTemplate.convertAndSend(destination, message);
            } else {
                // Khoa that bai (ghe da bi nguoi khac giu truoc) -> Gui canh bao lai cho client
                log.warn("[WS_LOCK_FAILED] Seat {} already locked for showtime {}", 
                        message.getSeatName(), message.getShowtimeId());
                SeatMessageDto rejectMsg = SeatMessageDto.builder()
                        .showtimeId(message.getShowtimeId())
                        .seatId(message.getSeatId())
                        .seatName(message.getSeatName())
                        .userId(message.getUserId())
                        .status(SeatStatus.HOLDING) // Thong bao ghe nay dang bi nguoi khac giu
                        .build();
                simpMessagingTemplate.convertAndSend(destination, rejectMsg);
            }
        } else if (message.getStatus() == SeatStatus.AVAILABLE) {
            // 2. Huy giu ghe trong Redis
            seatLockService.releaseSeat(message.getShowtimeId(), message.getSeatId(), message.getUserId());
            // Broadcast cho moi nguoi biet ghe da trong tro lai
            simpMessagingTemplate.convertAndSend(destination, message);
        } else if (message.getStatus() == SeatStatus.BOOKED) {
            // 3. Da thanh toan -> Broadcast ghe da ban vinh vien
            simpMessagingTemplate.convertAndSend(destination, message);
        }
    }
}


