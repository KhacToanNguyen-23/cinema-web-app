package com.cinema.service;

import java.util.List;

import com.cinema.entity.Region;

public interface RegionService {
    Region createRegion(Region region);
    Region updateRegion(Long id, Region region);
    void deleteRegion(Long id);
    List<Region> getAllRegions();
}
