package com.example.stockexchange.service;

import com.example.stockexchange.dto.StockExchangeDto;
import com.example.stockexchange.entity.Stock;
import com.example.stockexchange.entity.StockExchange;
import com.example.stockexchange.entity.StockListing;
import com.example.stockexchange.entity.StockListingId;
import com.example.stockexchange.exception.ResourceNotFoundException;
import com.example.stockexchange.mapper.StockExchangeMapper;
import com.example.stockexchange.repository.StockExchangeRepository;
import com.example.stockexchange.repository.StockListingRepository;
import com.example.stockexchange.repository.StockRepository;
import com.example.stockexchange.request.StockExchangeCreationRequest;
import com.example.stockexchange.request.StockExchangeUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class StockExchangeService {

    private final StockExchangeRepository stockExchangeRepository;
    private final StockRepository stockRepository;
    private final StockListingRepository stockListingRepository;
    private final StockExchangeMapper stockExchangeMapper;

    public StockExchangeService(StockExchangeRepository stockExchangeRepository, StockRepository stockRepository, StockListingRepository stockListingRepository, StockExchangeMapper stockExchangeMapper) {
        this.stockExchangeRepository = stockExchangeRepository;
        this.stockRepository = stockRepository;
        this.stockListingRepository = stockListingRepository;
        this.stockExchangeMapper = stockExchangeMapper;
    }

    @Transactional
    public Page<StockExchangeDto> getAllStockExchange(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<StockExchange> stockExchangePage = stockExchangeRepository.findAll(pageable);
        return stockExchangePage.map(stockExchangeMapper::map);
    }

    private long getNumberOfStocks(long stockExchangeId) {
        return stockListingRepository.countByStockExchangeId(stockExchangeId);
    }

    public StockExchangeDto createStockExchange(StockExchangeCreationRequest stockExchangeCreationRequest) {
        StockExchange stockExchange = stockExchangeMapper.map(stockExchangeCreationRequest);
         stockExchangeRepository.save(stockExchange);
         return stockExchangeMapper.map(stockExchange);
    }

    public StockExchangeDto updateStockExchange(long stockExchangeId , StockExchangeUpdateRequest stockExchangeUpdateRequest) {

        if (stockExchangeRepository.findById(stockExchangeId).isPresent()){
            stockExchangeRepository.save(stockExchangeMapper.map(stockExchangeUpdateRequest));
        } else {
            throw new ResourceNotFoundException("There is no Such Stock Exchange with id " + stockExchangeId);
        }
        return stockExchangeMapper.map(stockExchangeRepository.findById(stockExchangeId).get());
    }

    public StockExchangeDto deleteStockExchange(long stockExchangeId) {

        Optional<StockExchange> stockExchange = stockExchangeRepository.findById(stockExchangeId);

        if (stockExchange.isPresent()){
            stockExchangeRepository.deleteById(stockExchangeId);
            return stockExchangeMapper.map(stockExchange.get());
        } else {
            throw new ResourceNotFoundException("There is no Such Stock Exchange with id " + stockExchangeId);
        }
    }

    @Transactional
    public StockListing addStockToStockExchange(long stockExchangeId, long stockId) {

        StockListingId listingId = new StockListingId(stockExchangeId, stockId);

        if (stockListingRepository.findById(listingId).isPresent()) {
            throw new IllegalStateException("Stock already listed on this stock exchange.");
        }

        StockExchange stockExchange = stockExchangeRepository.findById(stockExchangeId).orElseThrow(() -> new IllegalArgumentException("Stock Exchange not found"));
        Stock stock = stockRepository.findById(stockId).orElseThrow(() -> new IllegalArgumentException("Stock Exchange not found"));

        StockListing stockListing = new StockListing(stockExchange, stock);
        stockListingRepository.save(stockListing);

        long count = getNumberOfStocks(stockExchangeId);

        boolean flag = count >= 10;

        if (flag != stockExchange.isLiveInMarket()) {
            stockExchange.setLiveInMarket(flag);
            stockExchangeRepository.save(stockExchange);
        }
        return stockListing;
    }

    @Transactional
    public StockListing removeStockFromStockExchange(long stockExchangeId, long stockId) {
        StockListingId listingId = new StockListingId(stockExchangeId, stockId);
        Optional<StockListing> stockListing = stockListingRepository.findById(listingId);

        if (stockListing.isPresent()) {
            stockListingRepository.deleteById(listingId);
        } else {
            throw new IllegalStateException("This Stock is not listed on this stock exchange.");
        }

        StockExchange stockExchange = stockExchangeRepository.findById(stockExchangeId).orElseThrow(() -> new IllegalArgumentException("Stock Exchange not found"));

        long count = getNumberOfStocks(stockExchangeId);

        boolean flag = count >= 10;

        if (flag != stockExchange.isLiveInMarket()) {
            stockExchange.setLiveInMarket(flag);
            stockExchangeRepository.save(stockExchange);
        }
        return stockListing.get();
    }
}
