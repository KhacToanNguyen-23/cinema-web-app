package com.cinema.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;
@Entity
@Table(name = "vouchers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Voucher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String code;
    private String description;
    private double discountAmount;
    private int discountPercentage;
    private double minSpend;
    private double maxDiscount;
    private LocalDateTime validUntil;
}
