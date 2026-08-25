package com.cinema.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "booking_snacks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingSnack {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @ManyToOne
    @JoinColumn(name = "booking_id", referencedColumnName = "id")
    private Booking booking;
    @ManyToOne
    @JoinColumn(name = "snack_id", referencedColumnName = "id")
    private Snack snack;
    private int quantity;
    private double price;
}
