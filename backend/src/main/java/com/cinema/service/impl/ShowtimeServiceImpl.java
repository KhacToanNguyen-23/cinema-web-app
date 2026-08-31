package com.cinema.service.impl;

import com.cinema.dto.ShowtimeDto;
import com.cinema.entity.Movie;
import com.cinema.entity.Room;
import com.cinema.entity.Showtime;
import com.cinema.entity.ShowtimeFormat;
import com.cinema.entity.User;
import com.cinema.mapper.ShowtimeMapper;
import com.cinema.repository.MovieRepository;
import com.cinema.repository.RoomRepository;
import com.cinema.repository.ShowtimeRepository;
import com.cinema.repository.UserRepository;
import com.cinema.service.MovieService;
import com.cinema.service.ShowtimeService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ShowtimeServiceImpl implements ShowtimeService {

    private final ShowtimeRepository showtimeRepository;
    private final MovieRepository movieRepository;
    private final RoomRepository roomRepository;
    private final MovieService movieService;
    private final UserRepository userRepository;
    private final ShowtimeMapper showtimeMapper;

    @Override
    public Showtime getShowtimeById(Long id) {
        return showtimeRepository.findById(id).filter(Showtime::isActive).orElse(null);
    }

    private void checkManagerPermissionByCinemaId(Long targetCinemaId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (username != null && !username.equals("anonymousUser")) {
            User user = userRepository.findByUsername(username).orElse(null);
            if (user != null && "MANAGER".equals(user.getRole())) {
                if (user.getCinema() == null) {
                    throw new RuntimeException("Lỗi: Quản lý này chưa được phân bổ vào rạp nào!");
                }
                if (targetCinemaId == null) {
                    throw new RuntimeException("Lỗi: Dữ liệu phòng chiếu không hợp lệ.");
                }
                long managerCinemaId = user.getCinema().getId();
                if (managerCinemaId != targetCinemaId) {
                    throw new RuntimeException("Access Denied: Bạn không có quyền thao tác lịch chiếu của rạp này!");
                }
            }
        }
    }

    private void checkManagerPermission(Showtime showtime) {
        if (showtime.getRoom() != null && showtime.getRoom().getCinema() != null) {
            checkManagerPermissionByCinemaId(showtime.getRoom().getCinema().getId());
        }
    }

    @Override
    @Transactional
    public List<ShowtimeDto> createShowtimes(List<ShowtimeDto> dtos) {
        if (dtos == null || dtos.isEmpty()) {
            throw new IllegalArgumentException("Danh sách suất chiếu không được để trống");
        }

        List<Showtime> showtimesToSave = new ArrayList<>();
        Set<Long> affectedMovieIds = new HashSet<>();

        for (ShowtimeDto dto : dtos) {
            if (dto.getMovieId() == null || dto.getRoomId() == null || dto.getStartTime() == null || dto.getEndTime() == null) {
                throw new IllegalArgumentException("Thông tin suất chiếu không đầy đủ (thiếu movieId, roomId, startTime hoặc endTime)");
            }

            if (!dto.getEndTime().isAfter(dto.getStartTime())) {
                throw new IllegalArgumentException("Thời gian kết thúc phải sau thời gian bắt đầu");
            }

            Room room = roomRepository.findById(dto.getRoomId())
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phòng chiếu với ID: " + dto.getRoomId()));

            Movie movie = movieRepository.findById(dto.getMovieId())
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phim với ID: " + dto.getMovieId()));

            // 1. Kiểm tra quyền Manager theo cụm rạp của phòng chiếu
            if (room.getCinema() != null) {
                checkManagerPermissionByCinemaId(room.getCinema().getId());
            }

            // 2. Kiểm tra xung đột thời gian trong phòng chiếu (Overlap Conflict Check)
            List<Showtime> conflicts = showtimeRepository.findOverlappingShowtimes(room.getId(), dto.getStartTime(), dto.getEndTime());
            if (!conflicts.isEmpty()) {
                Showtime conflict = conflicts.get(0);
                String conflictMovieTitle = conflict.getMovie() != null ? conflict.getMovie().getTitle() : "Phim khác";
                throw new IllegalArgumentException(
                        String.format("Xung đột lịch chiếu tại phòng [%s]: Khung giờ %s - %s đã bị trùng với suất chiếu của phim [%s] (%s - %s)",
                                room.getName(),
                                dto.getStartTime().toString(),
                                dto.getEndTime().toString(),
                                conflictMovieTitle,
                                conflict.getStartTime().toString(),
                                conflict.getEndTime().toString())
                );
            }

            // 3. Khởi tạo Entity
            Showtime showtime = new Showtime();
            showtime.setRoom(room);
            showtime.setMovie(movie);
            showtime.setStartTime(dto.getStartTime());
            showtime.setEndTime(dto.getEndTime());
            showtime.setPrice(dto.getPrice() > 0 ? dto.getPrice() : 80000.0);
            showtime.setFormat(dto.getFormat() != null ? dto.getFormat() : ShowtimeFormat.TWO_D_SUB);
            showtime.setActive(true);

            showtimesToSave.add(showtime);
            affectedMovieIds.add(movie.getId());
        }

        // 4. Lưu toàn bộ trong 1 Transaction
        List<Showtime> savedList = showtimeRepository.saveAll(showtimesToSave);

        // 5. Cập nhật trạng thái phim sang NOW_SHOWING nếu đủ điều kiện
        for (Long movieId : affectedMovieIds) {
            movieService.refreshMovieStatus(movieId);
        }

        return savedList.stream().map(showtimeMapper::toDto).toList();
    }

    @Override
    public Showtime updateShowtime(Long id, Showtime showtime) {
        Showtime existing = showtimeRepository.findById(id).orElseThrow();
        checkManagerPermission(existing); // Kiểm tra quyền sửa lịch cũ

        Long oldMovieId = (existing.getMovie() != null) ? existing.getMovie().getId() : null;
        
        existing.setStartTime(showtime.getStartTime());
        existing.setEndTime(showtime.getEndTime());
        existing.setPrice(showtime.getPrice());
        if (showtime.getFormat() != null) existing.setFormat(showtime.getFormat());
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
