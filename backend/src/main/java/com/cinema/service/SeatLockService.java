package com.cinema.service;

import java.util.Set;

/**
 * [AI UPDATE - Service quan ly khoa ghe bang Redis Distributed Lock]
 */
public interface SeatLockService {

    /**
     * Thu khoa giu ghe trong 5 phut (300 giay) bang lenh SETNX
     * @return true neu khoa thanh cong, false neu ghe da bi nguoi khac giu
     */
    boolean tryHoldSeat(Long showtimeId, Long seatId, Long userId);

    /**
     * Huy giu ghe (chi cho phep nguoi dang giu huy)
     */
    boolean releaseSeat(Long showtimeId, Long seatId, Long userId);

    /**
     * Kiem tra ghe co dang bi giu khong
     */
    boolean isSeatLocked(Long showtimeId, Long seatId);

    /**
     * Lay userId dang giu ghe
     */
    Long getLockedUserId(Long showtimeId, Long seatId);

    /**
     * Lay so giay con lai cua phien giu ghe
     */
    Long getRemainingHoldSeconds(Long showtimeId, Long seatId);

    /**
     * Lay danh sach tat ca seatId dang bi giu cua mot suat chieu
     */
    Set<Long> getLockedSeatIds(Long showtimeId);
}