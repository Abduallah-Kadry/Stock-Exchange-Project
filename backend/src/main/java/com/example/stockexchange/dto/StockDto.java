package com.example.stockexchange.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class StockDto {

    private long stockId;

    private String name;

    private String description;

    private double currentPrice;

    private LocalDateTime updatedAt;
}
