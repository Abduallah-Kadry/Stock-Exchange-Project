package com.example.stockexchange.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StockExchangeDto {

    private long StockExchangeId;

    private String name;

    private String description;

    private boolean liveInMarket;
}
