package com.cinema.service;

import java.util.List;

import com.cinema.entity.Showtime;

public interface ShowtimeService {
    // Tự định nghĩa các hàm ở đây
    Showtime getShowtimeById(Long id);
    Showtime createShowtime(Showtime showtime);
    Showtime updateShowtime(Long id, Showtime showtime);
    void deleteShowtime(Long id);
    List<Showtime> getAllShowtimes();
    List<Showtime> getShowtimesByCinemaId(Long cinemaId);
}

