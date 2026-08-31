package com.cinema.service.impl;

import com.cinema.entity.Room;
import com.cinema.repository.RoomRepository;
import com.cinema.repository.CinemaRepository;
import com.cinema.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.cinema.entity.Cinema;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final CinemaRepository cinemaRepository;

    @Override
    public Room createRoom(Room room) {
        if (room.getCinema() == null || room.getCinema().getId() <= 0) {
            throw new IllegalArgumentException("Cinema ID is required");
        }
        Cinema cinema = cinemaRepository.findById(room.getCinema().getId())
                .orElseThrow(() -> new IllegalArgumentException("Cinema not found"));
        
        // [AI UPDATE - Kiem tra chong trung ten phong trong cung mot cum rap]
        if (roomRepository.existsByCinemaIdAndNameIgnoreCaseAndIsActiveTrue(cinema.getId(), room.getName().trim())) {
            throw new IllegalArgumentException("Tên phòng [" + room.getName() + "] đã tồn tại trong cụm rạp này!");
        }

        room.setName(room.getName().trim());
        room.setCinema(cinema);
        room.setActive(true);
        return roomRepository.save(room);
    }

    @Override
    public Room updateRoom(Long id, Room roomDetails) {
        Room existing = roomRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));
        
        if (roomDetails.getCinema() != null && roomDetails.getCinema().getId() > 0) {
            Cinema cinema = cinemaRepository.findById(roomDetails.getCinema().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Cinema not found"));
            existing.setCinema(cinema);
        }

        existing.setRoomType(roomDetails.getRoomType());
        existing.setCapacity(roomDetails.getCapacity());
        existing.setName(roomDetails.getName());
        
        return roomRepository.save(existing);
    }

    @Override
    public void deleteRoom(Long id) {
        Room existing = roomRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));
        existing.setActive(false); // soft delete
        roomRepository.save(existing);
    }

    @Override
    public List<Room> getAllRooms() {
        return roomRepository.findAll().stream().filter(Room::isActive).toList();
    }

    @Override
    public List<Room> getRoomsByCinemaId(Long cinemaId) {
        return roomRepository.findByCinemaId(cinemaId).stream().filter(Room::isActive).toList();
    }
}
