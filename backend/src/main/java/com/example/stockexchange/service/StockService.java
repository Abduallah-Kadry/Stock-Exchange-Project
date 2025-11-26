package com.example.stockexchange.service;

import com.example.stockexchange.dto.StockDto;
import com.example.stockexchange.entity.Stock;
import com.example.stockexchange.exception.ResourceNotFoundException;
import com.example.stockexchange.mapper.StockMapper;
import com.example.stockexchange.repository.StockRepository;
import com.example.stockexchange.request.StockCreationRequest;
import com.example.stockexchange.request.StockPriceUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;


@Service
public class StockService {

    private final StockRepository stockRepository;
    private final StockMapper stockMapper;

    public StockService(StockRepository stockRepository, StockMapper stockMapper) {
        this.stockRepository = stockRepository;
        this.stockMapper = stockMapper;
    }

    @Transactional
    public Page<StockDto> getAllStocks(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Stock> stockPage = stockRepository.findAll(pageable);

        return stockPage.map(stockMapper::map);
    }

    public Stock createStock(StockCreationRequest stockCreationRequest) {
        Stock stock = stockMapper.map(stockCreationRequest);
        return stockRepository.save(stock);
    }

    @Transactional
    public StockDto updatePrice(long stockId, StockPriceUpdateRequest stockPriceUpdateRequest) {
        if(stockRepository.findById(stockId).isPresent()) {
            Stock stock = stockMapper.map(stockPriceUpdateRequest);
            stockRepository.save(stock);
            return stockMapper.map(stock);
        } else {
            throw new ResourceNotFoundException("Stock Not Found!");
        }
    }

    public StockDto deleteStock(long stockId) {

        Optional<Stock> stock = stockRepository.findById(stockId);

        if(stock.isPresent()){
            stockRepository.deleteById(stockId);
            return stockMapper.map(stock.get());
        }
        throw new ResourceNotFoundException("Stock Not Found!");
    }
}
