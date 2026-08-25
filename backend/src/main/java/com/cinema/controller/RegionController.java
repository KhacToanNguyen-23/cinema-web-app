package com.cinema.controller;

import com.cinema.dto.RegionDto;
import com.cinema.mapper.RegionMapper;
import com.cinema.service.RegionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/regions")
@RequiredArgsConstructor
public class RegionController {

    private final RegionService regionService;
    private final RegionMapper regionMapper;

    @GetMapping
    public ResponseEntity<List<RegionDto>> getAllRegions() {
        List<RegionDto> regions = regionService.getAllRegions()
                .stream()
                .map(regionMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(regions);
    }

    @PostMapping
    public ResponseEntity<RegionDto> createRegion(@RequestBody RegionDto regionDto) {
        return ResponseEntity.ok(
            regionMapper.toDto(regionService.createRegion(regionMapper.toEntity(regionDto)))
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<RegionDto> updateRegion(@PathVariable Long id, @RequestBody RegionDto regionDto) {
        return ResponseEntity.ok(
            regionMapper.toDto(regionService.updateRegion(id, regionMapper.toEntity(regionDto)))
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRegion(@PathVariable Long id) {
        regionService.deleteRegion(id);
        return ResponseEntity.noContent().build();
    }
}
