package com.cinema.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "seats")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    
    private boolean isActive;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;

    private String seatRow; // Hàng ghế (Ví dụ: "A", "B")
    private int seatColumn; // Cột ghế/Số thứ tự (Ví dụ: 1, 2, 3)

    // Hàm tiện ích để lấy tên ghế dạng "A1", "A2"
    public String getSeatName() {
        return this.seatRow + this.seatColumn;
    }
    
    @Enumerated(EnumType.STRING)
    private SeatType type;
    private double priceMultiplier;
}
