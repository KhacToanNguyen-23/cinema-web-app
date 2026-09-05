package com.cinema.dto;

import com.cinema.entity.MovieStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MovieDto {
    private Long id;
    private String title;
    private String description;
    private int duration; // in minutes

    // [AI UPDATE - Ho tro deserializer linh hoat ca chuoi yyyy-MM-dd va yyyy-MM-ddTHH:mm:ss]
    @com.fasterxml.jackson.databind.annotation.JsonDeserialize(using = com.cinema.config.FlexibleLocalDateTimeDeserializer.class)
    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime releaseDate;
    private String posterUrl;
    private String trailerUrl;
    private String director;
    private String cast;
    private String ageLimit;
    private MovieStatus status; // NOW_SHOWING, COMING_SOON, ENDED
    private String genre;       // Hành động, Kinh dị, Hài, ...
    private boolean isActive = true; 
}
