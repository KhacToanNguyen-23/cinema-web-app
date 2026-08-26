package com.cinema.repository;

import com.cinema.entity.Movie;
import com.cinema.entity.MovieStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    // 1. Chỉ lấy phim chưa bị xóa mềm
    List<Movie> findByIsActiveTrue();

    // 2. Lấy phim chưa bị xóa VÀ theo đúng status (NOW_SHOWING / COMING_SOON)
    List<Movie> findByIsActiveTrueAndStatus(MovieStatus status);
}

