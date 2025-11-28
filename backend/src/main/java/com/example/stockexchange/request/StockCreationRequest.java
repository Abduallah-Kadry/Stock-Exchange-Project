package com.example.stockexchange.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StockCreationRequest {

    @NotEmpty(message = "Name is mandatory")
    @Size(min = 1, max = 30, message = "Name must be at least 3 characters long")
    private String name;

    @NotEmpty(message = "Description is mandatory")
    @Size(min = 1, max = 30, message = "Description must be at least 3 characters long")
    private String description;

    @NotNull(message = "Price is mandatory")
    @Min(value = 0, message = "Price must equal or be more than zero")
    private Double currentPrice;
}
