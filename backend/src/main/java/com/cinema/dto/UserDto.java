package com.cinema.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String name;
    private String username;
    private String password; // Only used for create/update from client. Ignored when returning to client.
    private String email;
    private String phone;
    private String fullName;
    private String role;
    private int rewardPoint;
    private String memberTier;
    private LocalDateTime createdAt;
    private Long cinemaId;
}
