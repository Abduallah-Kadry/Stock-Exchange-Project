package com.example.stockexchange.mapper;

import com.example.stockexchange.dto.StockDto;
import com.example.stockexchange.entity.Stock;
import com.example.stockexchange.request.StockCreationRequest;
import com.example.stockexchange.request.StockPriceUpdateRequest;
import com.example.stockexchange.response.CreateStockResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;


@Mapper(componentModel = "spring")
public interface StockMapper {

    Stock map(StockCreationRequest stockCreationRequest);

    StockDto map(Stock stock);

    Stock map(StockPriceUpdateRequest stockPriceUpdateRequest);

    List<StockDto> map(List<Stock> stocks);

    CreateStockResponse toCreatStockResponse(Stock stock);
}
