package com.cinema.entity;

import io.micrometer.common.lang.Nullable;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
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
    @Column(nullable = false)
    @NotEmpty
    private String name;
    private boolean isActive;
    @ManyToOne
    @JoinColumn(name = "cinema_id")
    private Cinema cinema;
    private int capacity;
    private String roomType;
}
