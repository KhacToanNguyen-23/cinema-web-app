package com.cinema.repository;

import com.cinema.entity.BookingSnack;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingSnackRepository extends JpaRepository<BookingSnack, Long> {
    // Tự code các custom query (VD: findBy...) ở đây
}

