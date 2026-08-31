package com.cinema.repository;

import com.cinema.entity.Showtime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ShowtimeRepository extends JpaRepository<Showtime, Long> {
    // Kiem tra phim co suat chieu nao trong tuong lai khong
    boolean existsByMovieIdAndStartTimeAfter(Long movieId, LocalDateTime time);

    List<Showtime> findByRoomCinemaId(Long cinemaId);

    // [AI UPDATE - Tim kiem cac suat chieu bi trung khung gio trong cung mot phong chieu]
    @Query("SELECT s FROM Showtime s WHERE s.room.id = :roomId AND s.isActive = true AND s.startTime < :endTime AND s.endTime > :startTime")
    List<Showtime> findOverlappingShowtimes(
        @Param("roomId") Long roomId,
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime
    );
}
