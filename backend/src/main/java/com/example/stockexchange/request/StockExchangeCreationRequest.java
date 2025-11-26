package com.example.stockexchange.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StockExchangeCreationRequest {

    @NotEmpty(message = "name is mandatory")
    @Size(min = 1, max = 30, message = "name must be at least 3 characters long")
    private String name;

    @NotEmpty(message = "description is mandatory")
    @Size(min = 3, max = 30, message = "description must be at least 3 characters long")
    private String description;
}
