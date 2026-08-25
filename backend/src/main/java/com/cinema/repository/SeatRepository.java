package com.cinema.repository;

import com.cinema.entity.Seat;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
    // Tự code các custom query (VD: findBy...) ở đây
    List<Seat> findByRoomId(Long roomId);
}

