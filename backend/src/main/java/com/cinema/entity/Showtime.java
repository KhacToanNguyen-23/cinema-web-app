package com.cinema.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "showtimes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Showtime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    
    @ManyToOne
    @JoinColumn(name = "movie_id")
    private Movie movie;
    
    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;
    
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private double price;
    
    // [AI UPDATE - Bo sung truong format phan dinh phien ban phu de / long tieng]
    @Enumerated(EnumType.STRING)
    private ShowtimeFormat format = ShowtimeFormat.TWO_D_SUB;
    
    private boolean isActive = true;
}
