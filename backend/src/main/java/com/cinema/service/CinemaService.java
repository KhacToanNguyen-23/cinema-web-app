package com.cinema.service;

import java.util.List;

import com.cinema.entity.Cinema;

public interface CinemaService{
    Cinema createCinema(Cinema cinema);
    Cinema updateCinema(Long id, Cinema cinema);
    void deleteCinema(Long id);
    List<Cinema> getAllCinemas();
    
}
