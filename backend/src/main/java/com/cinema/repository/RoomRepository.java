package com.cinema.repository;

import com.cinema.entity.Room;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    // Tự code các custom query (VD: findBy...) ở đây
    List<Room> findByCinemaId(Long cinemaId);
    // [AI UPDATE - Kiem tra trung ten phong trong cung mot rap]
    boolean existsByCinemaIdAndNameIgnoreCaseAndIsActiveTrue(Long cinemaId, String name);
}

