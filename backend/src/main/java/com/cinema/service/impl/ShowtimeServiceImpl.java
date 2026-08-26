package com.cinema.service.impl;

import com.cinema.entity.Showtime;
import com.cinema.entity.User;
import com.cinema.repository.ShowtimeRepository;
import com.cinema.repository.MovieRepository;
import com.cinema.repository.RoomRepository;
import com.cinema.service.ShowtimeService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.List;
import com.cinema.service.MovieService;
import com.cinema.repository.*;

@Service
@RequiredArgsConstructor
public class ShowtimeServiceImpl implements ShowtimeService {

    private final ShowtimeRepository showtimeRepository;
    private final MovieRepository movieRepository;
    private final RoomRepository roomRepository;
    private final MovieService movieService;
    private final UserRepository userRepository;

    @Override
    public Showtime getShowtimeById(Long id) {
        return showtimeRepository.findById(id).filter(Showtime::isActive).orElse(null);
    }

    private void checkManagerPermission(Showtime showtime) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (username != null && !username.equals("anonymousUser")) {
            User user = userRepository.findByUsername(username).orElse(null);
            if (user != null && "MANAGER".equals(user.getRole())) {
                if (user.getCinema() == null) {
                    throw new RuntimeException("Lỗi: Quản lý này chưa được phân bổ vào rạp nào!");
                }
                if (showtime.getRoom() == null || showtime.getRoom().getCinema() == null) {
                    throw new RuntimeException("Lỗi: Dữ liệu phòng chiếu không hợp lệ.");
                }
                
                long managerCinemaId = user.getCinema().getId();
                long targetCinemaId = showtime.getRoom().getCinema().getId();
                
                if (managerCinemaId != targetCinemaId) {
                    throw new RuntimeException("Access Denied: Bạn không có quyền thao tác lịch chiếu của rạp này!");
                }
            }
        }
    }

    @Override
    public Showtime createShowtime(Showtime showtime) {
        checkManagerPermission(showtime);
        showtime.setActive(true);
        Showtime saved = showtimeRepository.save(showtime);
        if (saved.getMovie() != null) {
            movieService.refreshMovieStatus(saved.getMovie().getId());
        }
        return saved;
    }

    @Override
    public Showtime updateShowtime(Long id, Showtime showtime) {
        Showtime existing = showtimeRepository.findById(id).orElseThrow();
        checkManagerPermission(existing); // Kiểm tra quyền sửa lịch cũ

        Long oldMovieId = (existing.getMovie() != null) ? existing.getMovie().getId() : null;
        
        existing.setStartTime(showtime.getStartTime());
        existing.setEndTime(showtime.getEndTime());
        existing.setPrice(showtime.getPrice());
        if (showtime.getMovie() != null) existing.setMovie(showtime.getMovie());
        if (showtime.getRoom() != null) existing.setRoom(showtime.getRoom());
        
        checkManagerPermission(existing); // Kiểm tra quyền lưu vào phòng mới

        Showtime saved = showtimeRepository.save(existing);
        
        if (oldMovieId != null) movieService.refreshMovieStatus(oldMovieId);
        if (saved.getMovie() != null && !saved.getMovie().getId().equals(oldMovieId)) {
            movieService.refreshMovieStatus(saved.getMovie().getId());
        }
        return saved;
    }

    @Override
    public void deleteShowtime(Long id) {
        Showtime existing = showtimeRepository.findById(id).orElseThrow();
        checkManagerPermission(existing); // Kiểm tra quyền xóa
        
        existing.setActive(false);
        showtimeRepository.save(existing);
        if (existing.getMovie() != null) {
            movieService.refreshMovieStatus(existing.getMovie().getId());
        }
    }

    @Override
    public List<Showtime> getAllShowtimes() {
        return showtimeRepository.findAll().stream().filter(Showtime::isActive).toList();
    }

    @Override
    public List<Showtime> getShowtimesByCinemaId(Long cinemaId) {
        return showtimeRepository.findByRoomCinemaId(cinemaId).stream().filter(Showtime::isActive).toList();
    }
}
