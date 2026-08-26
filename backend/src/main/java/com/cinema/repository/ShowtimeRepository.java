package com.cinema.repository;

import com.cinema.entity.Showtime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;

@Repository
public interface ShowtimeRepository extends JpaRepository<Showtime, Long> {
    // Kiểm tra phim có suất chiếu nào trong tương lai không
    boolean existsByMovieIdAndStartTimeAfter(Long movieId, LocalDateTime time);

    java.util.List<Showtime> findByRoomCinemaId(Long cinemaId);
}
