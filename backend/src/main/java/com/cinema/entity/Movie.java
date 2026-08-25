package com.cinema.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "movies")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Long id;
    private String title;
    private String description;
    private int duration; // in minutes
    private LocalDateTime releaseDate;
    private String posterUrl;
    private String trailerUrl;
    private String director;
    
    @Column(name = "movie_cast")
    private String cast;
    
    private String ageLimit;
    private boolean isActive = true; 
    
}
