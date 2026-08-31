package com.cinema.service;

import java.util.List;
import com.cinema.dto.ShowtimeDto;
import com.cinema.entity.Showtime;

public interface ShowtimeService {
    Showtime getShowtimeById(Long id);
    // [AI UPDATE - Gop chung API create nhan danh sach List<ShowtimeDto> ho tro tao le lan tao hang loat]
    List<ShowtimeDto> createShowtimes(List<ShowtimeDto> dtos);
    Showtime updateShowtime(Long id, Showtime showtime);
    void deleteShowtime(Long id);
    List<Showtime> getAllShowtimes();
    List<Showtime> getShowtimesByCinemaId(Long cinemaId);
}
