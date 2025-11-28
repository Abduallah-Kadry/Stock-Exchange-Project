package com.example.stockexchange.service;

import com.example.stockexchange.dto.StockDto;
import com.example.stockexchange.dto.StockExchangeDto;
import com.example.stockexchange.entity.Stock;
import com.example.stockexchange.entity.StockExchange;
import com.example.stockexchange.entity.StockListing;
import com.example.stockexchange.exception.ResourceNotFoundException;
import com.example.stockexchange.mapper.StockExchangeMapper;
import com.example.stockexchange.mapper.StockMapper;
import com.example.stockexchange.repository.StockListingRepository;
import com.example.stockexchange.repository.StockRepository;
import com.example.stockexchange.request.StockCreationRequest;
import com.example.stockexchange.request.StockPriceUpdateRequest;
import com.example.stockexchange.response.CreateStockResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
@RequiredArgsConstructor
public class StockService {

    private final StockRepository stockRepository;
    private final StockListingRepository stockListingRepository;
    private final StockMapper stockMapper;
    private final StockExchangeMapper stockExchangeMapper;
    private final StockExchangeService stockExchangeService;


    public Page<StockDto> getAllStocks(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Stock> stockPage = stockRepository.findAll(pageable);
        return stockPage.map(stockMapper::map);
    }

    public Page<StockExchangeDto> getAllStockExchangesOwnParticularStock(long stockId,int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<StockExchange> stockExchangePage = stockListingRepository.findStockExchangesByStockId(stockId,pageable);

        return stockExchangePage.map(stockExchangeMapper::map);
    }

    @Transactional
    public CreateStockResponse createStock(StockCreationRequest stockCreationRequest) {
        Stock stock = stockMapper.map(stockCreationRequest);
        stockRepository.save(stock);
        return stockMapper.toCreatStockResponse(stock);
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

    @Transactional
    public void deleteStock(Long stockId) {
        Stock stock = stockRepository.findById(stockId)
                .orElseThrow(() -> new ResourceNotFoundException("Stock not found with id: " + stockId));

        List<StockExchange> affectedExchanges = stock.getStockListings().stream()
                .map(StockListing::getStockExchange)
                .distinct()
                .toList();

        stockRepository.delete(stock);

        affectedExchanges.forEach(stockExchangeService::updateLiveMarketStatus);
    }

    public StockDto getStockById(Long stockId) {

        return stockMapper.map(stockRepository.findById(stockId)
                .orElseThrow(() -> new ResourceNotFoundException("Stock Not Found!")));
    }
}
