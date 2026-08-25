package com.cinema.repository;

import com.cinema.entity.Cinema;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CinemaRepository extends JpaRepository<Cinema, Long> {
    // Tự code các custom query (VD: findBy...) ở đây
    Cinema findByName(String name);
    boolean existsByName(String name);

    List<Cinema> findByIsActiveTrue();
}

