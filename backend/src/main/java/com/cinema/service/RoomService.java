package com.cinema.service;

import java.util.List;
import com.cinema.entity.Room;

public interface RoomService {
    Room createRoom(Room room);
    Room updateRoom(Long id, Room room);
    void deleteRoom(Long id);
    List<Room> getAllRooms();
    List<Room> getRoomsByCinemaId(Long cinemaId);
}
