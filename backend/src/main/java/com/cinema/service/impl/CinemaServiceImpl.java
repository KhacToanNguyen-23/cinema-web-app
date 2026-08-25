package com.cinema.service.impl;
import java.util.List;
import javax.imageio.IIOException;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import com.cinema.entity.Cinema;
import com.cinema.repository.CinemaRepository;
import com.cinema.service.CinemaService;

@Service
@RequiredArgsConstructor
public class CinemaServiceImpl implements CinemaService {

    private final CinemaRepository cinemaRepository;
    private final com.cinema.repository.RegionRepository regionRepository;

    @Override
    public Cinema createCinema(Cinema cinema) {
        if (cinemaRepository.existsByName(cinema.getName())) {
            throw new IllegalArgumentException("Cinema with name " + cinema.getName() + " already exists.");
        }
        
        // Kiểm tra Region có tồn tại không
        if (cinema.getRegion() != null && cinema.getRegion().getId() > 0) {
            com.cinema.entity.Region region = regionRepository.findById(cinema.getRegion().getId())
                .orElseThrow(() -> new IllegalArgumentException("Region does not exist."));
            cinema.setRegion(region);
        } else {
            throw new IllegalArgumentException("Region is required for a Cinema.");
        }

        cinema.setActive(true);
        return cinemaRepository.save(cinema);
    }

    @Override
    public Cinema updateCinema(Long id, Cinema cinemaDetails) {
        Cinema existingCinema = cinemaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cinema with id " + id + " does not exist."));
        
        if (!existingCinema.getName().equals(cinemaDetails.getName()) && cinemaRepository.existsByName(cinemaDetails.getName())) {
            throw new IllegalArgumentException("Cinema with name " + cinemaDetails.getName() + " already exists.");
        }
        
        if (cinemaDetails.getRegion() != null && cinemaDetails.getRegion().getId() > 0) {
            com.cinema.entity.Region region = regionRepository.findById(cinemaDetails.getRegion().getId())
                .orElseThrow(() -> new IllegalArgumentException("Region does not exist."));
            existingCinema.setRegion(region);
        }
        
        existingCinema.setName(cinemaDetails.getName());
        existingCinema.setAddress(cinemaDetails.getAddress());
        existingCinema.setPhoneNumber(cinemaDetails.getPhoneNumber());
        
        return cinemaRepository.save(existingCinema);
    }

    @Override
    public void deleteCinema(Long id) {
        Cinema existingCinema = cinemaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cinema with id " + id + " does not exist."));
        
        // Soft delete
        existingCinema.setActive(false);
        cinemaRepository.save(existingCinema);
    }

    @Override
    public List<Cinema> getAllCinemas() {
        return cinemaRepository.findByIsActiveTrue();
    }
}
