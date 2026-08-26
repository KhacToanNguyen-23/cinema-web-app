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

    @Enumerated(EnumType.STRING)
    private MovieStatus status = MovieStatus.COMING_SOON; // Mặc định: Sắp chiếu

    private String genre; // Thể loại: Hành động, Kinh dị, Hài, ...

    /**
     * Nếu true → Admin đã set status thủ công, Scheduled job sẽ không ghi đè.
     * Nếu false → Status được tự tính từ releaseDate + Showtime.
     */
    @Column(columnDefinition = "boolean default false")
    private Boolean manualStatusOverride = false;
    private boolean isActive = true; 
    
}
