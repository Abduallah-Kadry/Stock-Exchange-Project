package com.example.stockexchange.repository;

import com.example.stockexchange.entity.Stock;
import com.example.stockexchange.entity.StockExchange;
import com.example.stockexchange.entity.StockListing;
import com.example.stockexchange.entity.StockListingId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockListingRepository extends JpaRepository<StockListing, StockListingId> {

    @Query("SELECT COUNT(sl) FROM stock_listing sl WHERE sl.stockExchange.StockExchangeId = :id")
    long countByStockExchangeId(@Param("id") Long stockExchangeId);

    @Query("SELECT sl.stock FROM stock_listing sl WHERE sl.stockExchange.StockExchangeId = :id")
    Page<Stock> findStocksByStockExchangeId(@Param("id") Long stockExchangeId, Pageable pageable);

    @Query("SELECT sl.stockExchange FROM stock_listing sl WHERE sl.stock.stockId = :id")
    Page<StockExchange> findStockExchangesByStockId(@Param("id") Long stockId, Pageable pageable);
}
