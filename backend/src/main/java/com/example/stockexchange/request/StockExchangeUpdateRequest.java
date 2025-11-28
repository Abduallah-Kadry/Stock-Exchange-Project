package com.example.stockexchange.request;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StockExchangeUpdateRequest {

    private String name;

    private String description;

    private boolean liveInMarket;
}
