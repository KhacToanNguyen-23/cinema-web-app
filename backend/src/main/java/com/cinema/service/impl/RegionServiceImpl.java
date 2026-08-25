package com.cinema.service.impl;

import java.util.List;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import com.cinema.entity.Region;
import com.cinema.repository.RegionRepository;
import com.cinema.service.RegionService;

@Service
@RequiredArgsConstructor
public class RegionServiceImpl implements RegionService {

    private final RegionRepository regionRepository;

    @Override
    public Region createRegion(Region region) {
        if (regionRepository.existsByName(region.getName())) {
            throw new IllegalArgumentException("Region with name " + region.getName() + " already exists.");
        }
        if (regionRepository.existsByCode(region.getCode())) {
            throw new IllegalArgumentException("Region with code " + region.getCode() + " already exists.");
        }
        region.setActive(true); // Đảm bảo active khi tạo mới
        return regionRepository.save(region);
    }

    @Override
    public Region updateRegion(Long id, Region regionDetails) {
        Region existingRegion = regionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Region with id " + id + " does not exist."));
        
        if (!existingRegion.getName().equals(regionDetails.getName()) && regionRepository.existsByName(regionDetails.getName())) {
            throw new IllegalArgumentException("Region with name " + regionDetails.getName() + " already exists.");
        }
        
        existingRegion.setName(regionDetails.getName());
        existingRegion.setCode(regionDetails.getCode());
        
        return regionRepository.save(existingRegion);
    }

    @Override
    public void deleteRegion(Long id) {
        Region existingRegion = regionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Region with id " + id + " does not exist."));
        
        // Thực hiện Xóa mềm (Soft Delete)
        existingRegion.setActive(false);
        regionRepository.save(existingRegion);
    }

    @Override
    public List<Region> getAllRegions() {
        // Chỉ lấy các Region đang active
        return regionRepository.findByIsActiveTrue();
    }
}
