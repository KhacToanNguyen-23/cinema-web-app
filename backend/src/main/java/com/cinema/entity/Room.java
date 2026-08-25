package com.cinema.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "rooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    
    private boolean isActive;
    @ManyToOne
    @JoinColumn(name = "cinema_id")
    private Cinema cinema;
    private int capacity;
    private String roomType;
}
