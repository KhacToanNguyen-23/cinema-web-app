package com.cinema.service.impl;

import com.cinema.entity.Showtime;
import com.cinema.repository.ShowtimeRepository;
import com.cinema.repository.MovieRepository;
import com.cinema.repository.RoomRepository;
import com.cinema.service.ShowtimeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ShowtimeServiceImpl implements ShowtimeService {

    private final ShowtimeRepository showtimeRepository;
    private final MovieRepository movieRepository;
    private final RoomRepository roomRepository;

    @Override
    public Showtime getShowtimeById(Long id) {
        return showtimeRepository.findById(id).filter(Showtime::isActive).orElse(null);
    }

    @Override
    public Showtime createShowtime(Showtime showtime) {
        showtime.setActive(true);
        return showtimeRepository.save(showtime);
    }

    @Override
    public Showtime updateShowtime(Long id, Showtime showtime) {
        Showtime existing = showtimeRepository.findById(id).orElseThrow();
        existing.setStartTime(showtime.getStartTime());
        existing.setEndTime(showtime.getEndTime());
        existing.setPrice(showtime.getPrice());
        if (showtime.getMovie() != null) existing.setMovie(showtime.getMovie());
        if (showtime.getRoom() != null) existing.setRoom(showtime.getRoom());
        return showtimeRepository.save(existing);
    }

    @Override
    public void deleteShowtime(Long id) {
        Showtime existing = showtimeRepository.findById(id).orElseThrow();
        existing.setActive(false);
        showtimeRepository.save(existing);
    }

    @Override
    public List<Showtime> getAllShowtimes() {
        return showtimeRepository.findAll().stream().filter(Showtime::isActive).toList();
    }
}
