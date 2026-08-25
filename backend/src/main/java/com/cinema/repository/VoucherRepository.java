package com.cinema.repository;

import com.cinema.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, Long> {
    // Tự code các custom query (VD: findBy...) ở đây
}

