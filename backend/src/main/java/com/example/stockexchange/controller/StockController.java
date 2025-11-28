package com.example.stockexchange.controller;

import com.example.stockexchange.dto.StockDto;
import com.example.stockexchange.dto.StockExchangeDto;
import com.example.stockexchange.request.StockCreationRequest;
import com.example.stockexchange.request.StockPriceUpdateRequest;
import com.example.stockexchange.response.ApiRespond;
import com.example.stockexchange.response.CreateStockResponse;
import com.example.stockexchange.service.StockService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RequestMapping("${app.paths.api-base}${app.paths.api-version}/stock")
@RequiredArgsConstructor
@Validated
@RestController
@Tag(name = "Stock Rest API Endpoints", description = "Operations related to stocks in the system")
public class StockController {

    private final StockService stockService;

    @Operation(summary = "Get all stocks on pages default page size 5", description = "Retrieve a pages of stocks in the system")
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("")
    public ResponseEntity<ApiRespond> getAllStocks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        Page<StockDto> stocks = stockService.getAllStocks(page, size);
        return ResponseEntity.ok(new ApiRespond(HttpStatus.OK, "All Available Stocks", stocks));
    }


    @Operation(summary = "get stock by id", description = "get stock by id")
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/{id}")
    public ResponseEntity<ApiRespond> getStockById(@PathVariable Long id) {

        return ResponseEntity.ok(new ApiRespond(HttpStatus.OK, "Stock with id: %d found".formatted(id), stockService.getStockById(id)));

    }

    @Operation(summary = "Get all stockExchange that own A particular Stock which A on pages default page size 5", description = "Get all stockExchange that own A particular Stock which A on pages default page size 5")
    @PreAuthorize("ROLE_USER")
    @GetMapping("/{id}/stockExchanges")
    public ResponseEntity<ApiRespond> getAllStockExchangesOwnStock(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @PathVariable long id) {

        Page<StockExchangeDto> stockExchangeDto = stockService.getAllStockExchangesOwnParticularStock(id, page, size);
        return ResponseEntity.ok(new ApiRespond(HttpStatus.OK, "Page Stocks In This StockExchange", stockExchangeDto));
    }


    @Operation(summary = "create a stock on the system", description = "create a new stock on the system")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("ROLE_ADMIN")
    @PostMapping("")
    public ResponseEntity<ApiRespond<CreateStockResponse>> createStock(@Valid @RequestBody StockCreationRequest stockCreationRequest) {
        return ResponseEntity.ok(new ApiRespond<>(HttpStatus.OK,
                "Stock created successfully", stockService.createStock(stockCreationRequest)));

    }

    @Operation(summary = "update a stock price on the system", description = "update a stock price on the system")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("ROLE_ADMIN")
    @PutMapping("/{id}")
    public ResponseEntity<ApiRespond> updateStockPrice(@PathVariable long id, StockPriceUpdateRequest stockPriceUpdateRequest) {
        return ResponseEntity.ok(new ApiRespond(HttpStatus.OK,
                "Stock Price updated successfully", stockService.updatePrice(id, stockPriceUpdateRequest)));
    }

    @Operation(summary = "delete a stock from the system", description = "delete a stock from the system")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("ROLE_ADMIN")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiRespond> deleteStockExchange(@PathVariable long id) {
        return ResponseEntity.ok(new ApiRespond(HttpStatus.OK,
                "Stock deleted successfully", stockService.deleteStock(id)));
    }
}
