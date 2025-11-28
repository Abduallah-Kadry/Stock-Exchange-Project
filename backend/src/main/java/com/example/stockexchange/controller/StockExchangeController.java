package com.example.stockexchange.controller;


import com.example.stockexchange.dto.StockDto;
import com.example.stockexchange.dto.StockExchangeDto;
import com.example.stockexchange.request.StockExchangeCreationRequest;
import com.example.stockexchange.request.StockExchangeUpdateRequest;
import com.example.stockexchange.response.ApiRespond;
import com.example.stockexchange.service.StockExchangeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RequestMapping("${app.paths.api-base}${app.paths.api-version}/stockExchange")
@RequiredArgsConstructor
@Validated
@RestController
@Tag(name = "StockExchange Rest API Endpoints", description = "Operations related to StockExchanges in the system")
public class StockExchangeController {

    private final StockExchangeService stockExchangeService;

    @Operation(summary = "Get all stockExchanges on pages default page size 5", description = "Retrieve a pages of stockExchanges in the system")
    @PreAuthorize("ROLE_USER")
    @GetMapping("")
    public ResponseEntity<ApiRespond> getAllStockExchanges(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        Page<StockExchangeDto> stockExchanges = stockExchangeService.getAllStockExchange(page, size);
        return ResponseEntity.ok(new ApiRespond(HttpStatus.OK, "All Available StockExchanges", stockExchanges));

    }

    @Operation(summary = "Get stock exchange by ID", description = "Retrieve a specific stock exchange by its ID")
    @PreAuthorize("ROLE_USER")
    @GetMapping("/{id}")
    public ResponseEntity<ApiRespond> getStockExchangeById(@PathVariable long id) {
        StockExchangeDto stockExchange = stockExchangeService.getStockExchangeById(id);
        return ResponseEntity.ok(new ApiRespond(HttpStatus.OK, "Stock Exchange retrieved successfully", stockExchange));
    }


    @Operation(summary = "Get all live Stock Exchanges", description = "Retrieves all Stock Exchanges that are currently live in the market")
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/live")
    public ResponseEntity<ApiRespond> getAllStockExchangesLiveInMarket(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<StockExchangeDto> liveExchanges = stockExchangeService.getAllStockExchangesLiveInMarket(page, size);

        return ResponseEntity.ok(new ApiRespond(
                HttpStatus.OK,
                "Live Stock Exchanges retrieved successfully",
                liveExchanges
        ));
    }


    @Operation(summary = "Get all stocks in A particular StockExchange which A on pages default page size 5", description = "Get all stocks in A particular StockExchange which A on pages default page size 5")
    @PreAuthorize("ROLE_USER")
    @GetMapping("/{id}/stocks")
    public ResponseEntity<ApiRespond> getAllStocksByExchange(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "stockName") String sortBy) {

        Page<StockDto> stocks = stockExchangeService.getAllStocksByExchange(id, page, size, sortBy);
        return ResponseEntity.ok(new ApiRespond(HttpStatus.OK, "All Available Stocks In StockExchange", stocks));
    }

    @Operation(summary = "create a new StockExchange on the system", description = "create a new StockExchange on the system")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("ROLE_USER")
    @PostMapping("")
    public ResponseEntity<ApiRespond> createStockExchange(@Valid @RequestBody StockExchangeCreationRequest stockExchangeCreationRequest) {

        return ResponseEntity.ok(new ApiRespond(HttpStatus.OK,
                "StockExchange created successfully", stockExchangeService.createStockExchange(stockExchangeCreationRequest)));

    }

    @Operation(summary = "update a stockExchange on the system", description = "update a existing stockExchange in the system")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("ROLE_USER")
    @PutMapping("/{id}")
    public ResponseEntity<ApiRespond> updateStockExchange(@PathVariable long id,@Valid @RequestBody StockExchangeUpdateRequest stockExchangeUpdateRequest) {
        return ResponseEntity.ok(new ApiRespond(HttpStatus.OK,
                "Stock Price updated successfully", stockExchangeService.updateStockExchange(id, stockExchangeUpdateRequest)));
    }

    @Operation(summary = "delete a stockExchange from the system", description = "delete a stockExchange from the system")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("ROLE_USER")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStockExchange(@PathVariable Long id) {
        stockExchangeService.deleteStockExchange(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Add a stock to stockExchange on the system", description = "Add a stock to stockExchange on the system")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("ROLE_USER")
    @PutMapping("/addStock")
    public ResponseEntity<ApiRespond> addStockToStockExchange(@RequestParam long stockExchangeId, @RequestParam long stockId) {
        return ResponseEntity.ok(new ApiRespond(HttpStatus.OK,
                "Stock Added successfully to StockExchange", stockExchangeService.addStockToStockExchange(stockExchangeId, stockId)));
    }

    @Operation(summary = "Delete a stock From stockExchange on the system", description = "Add a stock to stockExchange From the system")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("ROLE_USER")
    @DeleteMapping("/{stockExchangeId}/stocks/{stockId}")
    public ResponseEntity<Void> removeStockFromStockExchange(
            @PathVariable Long stockExchangeId,
            @PathVariable Long stockId) {

        stockExchangeService.removeStockFromStockExchange(stockExchangeId, stockId);
        return ResponseEntity.noContent().build(); // 204 No Content
    }
}
