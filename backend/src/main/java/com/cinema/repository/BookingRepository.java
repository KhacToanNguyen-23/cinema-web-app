package com.cinema.repository;

import com.cinema.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    // Tự code các custom query (VD: findBy...) ở đây
}

