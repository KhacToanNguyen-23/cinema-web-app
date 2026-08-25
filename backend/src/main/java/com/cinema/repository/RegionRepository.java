package com.cinema.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.cinema.entity.Region;
import java.util.List;

public interface RegionRepository extends JpaRepository<Region, Long> {
    // Tự code các custom query (VD: findBy...) ở đây
    Region findByCode(String code);
    Region findByName(String name);
    boolean existsByName(String name);
    boolean existsByCode(String code);

    // Tìm tất cả Region đang active (dùng cho Xóa mềm)
    List<Region> findByIsActiveTrue();
}
