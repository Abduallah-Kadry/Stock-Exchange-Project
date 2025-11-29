package com.example.stockexchange.service;

import com.example.stockexchange.dto.StockDto;
import com.example.stockexchange.dto.StockExchangeDto;
import com.example.stockexchange.dto.StockListingDto;
import com.example.stockexchange.entity.Stock;
import com.example.stockexchange.entity.StockExchange;
import com.example.stockexchange.entity.StockListing;
import com.example.stockexchange.entity.StockListingId;
import com.example.stockexchange.exception.DuplicateResourceException;
import com.example.stockexchange.exception.ResourceNotFoundException;
import com.example.stockexchange.mapper.StockExchangeMapper;
import com.example.stockexchange.mapper.StockMapper;
import com.example.stockexchange.repository.StockExchangeRepository;
import com.example.stockexchange.repository.StockListingRepository;
import com.example.stockexchange.repository.StockRepository;
import com.example.stockexchange.request.StockExchangeCreationRequest;
import com.example.stockexchange.request.StockExchangeUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class StockExchangeService {

    private final StockExchangeRepository stockExchangeRepository;
    private final StockRepository stockRepository;
    private final StockListingRepository stockListingRepository;
    private final StockExchangeMapper stockExchangeMapper;
    private final StockMapper stockMapper;

    public Page<StockExchangeDto> getAllStockExchanges(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<StockExchange> stockExchangePage = stockExchangeRepository.findAll(pageable);
        return stockExchangePage.map(stockExchangeMapper::map);
    }

    public Page<StockExchangeDto> getAllStockExchangesLiveInMarket(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<StockExchange> stockExchangePage = stockExchangeRepository.findByLiveInMarketTrue(pageable);
        return stockExchangePage.map(stockExchangeMapper::map);
    }

    private Long getNumberOfStocks(long stockExchangeId) {
        return stockListingRepository.countByStockExchangeId(stockExchangeId);
    }

    public StockExchangeDto createStockExchange(StockExchangeCreationRequest stockExchangeCreationRequest) {
        StockExchange stockExchange = stockExchangeMapper.map(stockExchangeCreationRequest);
        stockExchangeRepository.save(stockExchange);
        return stockExchangeMapper.map(stockExchange);
    }

    @Transactional
    public StockExchangeDto updateStockExchange(long stockExchangeId, StockExchangeUpdateRequest stockExchangeUpdateRequest) {
        StockExchange stockExchange = stockExchangeRepository.findById(stockExchangeId)
                .orElseThrow(() -> new ResourceNotFoundException("Stock Exchange not found with id: " + stockExchangeId));

        stockExchangeMapper.map(stockExchangeUpdateRequest, stockExchange);
        StockExchange updatedStockExchange = stockExchangeRepository.save(stockExchange);

        return stockExchangeMapper.map(updatedStockExchange);

    }

    @Transactional
    public void deleteStockExchange(Long stockExchangeId) {
        StockExchange stockExchange = stockExchangeRepository.findById(stockExchangeId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Stock Exchange not found with id: " + stockExchangeId));

        stockExchangeRepository.delete(stockExchange);
        // StockListings are automatically deleted due to cascade
        // Stocks remain untouched
    }

    public Page<StockDto> getAllStocksByExchange(Long stockExchangeId, int page, int size, String sortBy) {
        if (!stockExchangeRepository.existsById(stockExchangeId)) {
            throw new ResourceNotFoundException("Stock Exchange not found with id: " + stockExchangeId);
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).ascending());
        Page<Stock> stockPage = stockListingRepository.findStocksByStockExchangeId(stockExchangeId, pageable);
        return stockPage.map(stockMapper::map);
    }

    @Transactional
    public StockListingDto addStockToStockExchange(Long stockExchangeId, Long stockId) {

        StockListingId listingId = new StockListingId(stockExchangeId, stockId);
        if (stockListingRepository.existsById(listingId)) {
            throw new DuplicateResourceException(
                    "Stock with id " + stockId + " is already listed on Stock Exchange with id " + stockExchangeId);
        }

        StockExchange stockExchange = stockExchangeRepository.findById(stockExchangeId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Stock Exchange not found with id: " + stockExchangeId));

        Stock stock = stockRepository.findById(stockId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Stock not found with id: " + stockId));

        StockListing stockListing = new StockListing(stockExchange, stock);
        stockListingRepository.save(stockListing);

        updateLiveMarketStatus(stockExchange);

        return new StockListingDto(stockExchangeMapper.map(stockExchange), stockMapper.map(stock));
    }


    @Transactional
    public void removeStockFromStockExchange(Long stockExchangeId, Long stockId) {
        StockExchange stockExchange = stockExchangeRepository.findById(stockExchangeId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Stock Exchange not found with id: " + stockExchangeId));

        StockListingId listingId = new StockListingId(stockExchangeId, stockId);
        StockListing stockListing = stockListingRepository.findById(listingId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Stock with id " + stockId + " is not listed on this Stock Exchange"));

        stockListingRepository.delete(stockListing);

        updateLiveMarketStatus(stockExchange);
    }

    public void updateLiveMarketStatus(StockExchange stockExchange) {
        long remainingStocks = getNumberOfStocks(stockExchange.getStockExchangeId());
        boolean shouldBeLive = remainingStocks >= 10;

        if (stockExchange.isLiveInMarket() != shouldBeLive) {
            stockExchange.setLiveInMarket(shouldBeLive);
            // No need to call save() if using @Transactional - changes are auto-detected
        }
    }
}
