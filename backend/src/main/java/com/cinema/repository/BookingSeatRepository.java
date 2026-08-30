package com.cinema.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cinema.entity.BookingSeat;

@Repository
public interface BookingSeatRepository extends JpaRepository<BookingSeat, Long> {
    // [AI UPDATE - Tim danh sach ghe da dat theo suat chieu]
    List<BookingSeat> findByBookingShowtimeId(Long showtimeId);
}


