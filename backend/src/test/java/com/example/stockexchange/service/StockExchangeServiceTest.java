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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StockExchangeServiceTest {

    @Mock
    private StockExchangeRepository stockExchangeRepository;

    @Mock
    private StockRepository stockRepository;

    @Mock
    private StockListingRepository stockListingRepository;

    @Mock
    private StockExchangeMapper stockExchangeMapper;

    @Mock
    private StockMapper stockMapper;

    @InjectMocks
    private StockExchangeService stockExchangeService;

    private StockExchange stockExchange;
    private StockExchangeDto stockExchangeDto;
    private Stock stock;
    private StockDto stockDto;
    private StockListing stockListing;

    @BeforeEach
    void setUp() {
        // Setup StockExchange entity
        stockExchange = new StockExchange();
        stockExchange.setStockExchangeId(1L);
        stockExchange.setName("NYSE");
        stockExchange.setDescription("New York Stock Exchange");
        stockExchange.setLiveInMarket(true);

        // Setup StockExchangeDto
        stockExchangeDto = new StockExchangeDto();
        stockExchangeDto.setStockExchangeId(1L);
        stockExchangeDto.setName("NYSE");
        stockExchangeDto.setDescription("New York Stock Exchange");
        stockExchangeDto.setLiveInMarket(true);

        // Setup Stock entity
        stock = new Stock();
        stock.setStockId(1L);
        stock.setName("Apple Inc.");
        stock.setDescription("Technology company");
        stock.setCurrentPrice(BigDecimal.valueOf(150.00));

        // Setup StockDto
        stockDto = new StockDto();
        stockDto.setStockId(1L);
        stockDto.setName("Apple Inc.");
        stockDto.setDescription("Technology company");
        stockDto.setCurrentPrice(BigDecimal.valueOf(150.00));

        // Setup StockListing
        stockListing = new StockListing(stockExchange, stock);
    }

    // ==================== deleteStockExchange Tests ====================

    @Test
    @DisplayName("Should delete stock exchange successfully")
    void deleteStockExchange_Success() {
        // Arrange
        when(stockExchangeRepository.findById(1L)).thenReturn(Optional.of(stockExchange));
        doNothing().when(stockExchangeRepository).delete(any(StockExchange.class));

        // Act
        stockExchangeService.deleteStockExchange(1L);

        // Assert
        verify(stockExchangeRepository, times(1)).findById(1L);
        verify(stockExchangeRepository, times(1)).delete(stockExchange);
    }

    @Test
    @DisplayName("Should throw exception when deleting non-existent stock exchange")
    void deleteStockExchange_NotFound() {
        // Arrange
        when(stockExchangeRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> stockExchangeService.deleteStockExchange(999L)
        );

        assertEquals("Stock Exchange not found with id: 999", exception.getMessage());

        verify(stockExchangeRepository, times(1)).findById(999L);
        verify(stockExchangeRepository, never()).delete(any(StockExchange.class));
    }

    @Test
    @DisplayName("Should delete stock exchange and cascade delete listings")
    void deleteStockExchange_CascadeDelete() {
        // Arrange
        when(stockExchangeRepository.findById(1L)).thenReturn(Optional.of(stockExchange));
        doNothing().when(stockExchangeRepository).delete(any(StockExchange.class));

        // Act
        stockExchangeService.deleteStockExchange(1L);

        // Assert
        verify(stockExchangeRepository, times(1)).findById(1L);
        verify(stockExchangeRepository, times(1)).delete(stockExchange);
        // Cascade delete is handled by JPA, no explicit listing deletion needed
    }

    @Test
    @DisplayName("Should delete stock exchange with null listings")
    void deleteStockExchange_NullListings() {
        // Arrange
        stockExchange.setStockListings(null);
        when(stockExchangeRepository.findById(1L)).thenReturn(Optional.of(stockExchange));
        doNothing().when(stockExchangeRepository).delete(any(StockExchange.class));

        // Act
        assertDoesNotThrow(() -> stockExchangeService.deleteStockExchange(1L));

        // Assert
        verify(stockExchangeRepository, times(1)).findById(1L);
        verify(stockExchangeRepository, times(1)).delete(stockExchange);
    }

    // ==================== getAllStocksByExchange Tests ====================

    @Test
    @DisplayName("Should return stocks for valid stock exchange")
    void getAllStocksByExchange_Success() {
        // Arrange
        List<Stock> stocks = List.of(stock);
        Page<Stock> stockPage = new PageImpl<>(stocks, PageRequest.of(0, 10), 1);

        when(stockExchangeRepository.existsById(1L)).thenReturn(true);
        when(stockListingRepository.findStocksByStockExchangeId(anyLong(), any(Pageable.class)))
                .thenReturn(stockPage);
        when(stockMapper.map(any(Stock.class))).thenReturn(stockDto);

        // Act
        Page<StockDto> result = stockExchangeService.getAllStocksByExchange(1L, 0, 10, "name");

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("Apple Inc.", result.getContent().get(0).getName());

        verify(stockExchangeRepository, times(1)).existsById(1L);
        verify(stockListingRepository, times(1))
                .findStocksByStockExchangeId(anyLong(), any(Pageable.class));
        verify(stockMapper, times(1)).map(any(Stock.class));
    }

    @Test
    @DisplayName("Should throw exception when stock exchange not found")
    void getAllStocksByExchange_ExchangeNotFound() {
        // Arrange
        when(stockExchangeRepository.existsById(999L)).thenReturn(false);

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> stockExchangeService.getAllStocksByExchange(999L, 0, 10, "name")
        );

        assertEquals("Stock Exchange not found with id: 999", exception.getMessage());

        verify(stockExchangeRepository, times(1)).existsById(999L);
        verify(stockListingRepository, never())
                .findStocksByStockExchangeId(anyLong(), any(Pageable.class));
    }

    @Test
    @DisplayName("Should return empty page when exchange has no stocks")
    void getAllStocksByExchange_NoStocks() {
        // Arrange
        Page<Stock> emptyPage = new PageImpl<>(List.of(), PageRequest.of(0, 10), 0);

        when(stockExchangeRepository.existsById(1L)).thenReturn(true);
        when(stockListingRepository.findStocksByStockExchangeId(anyLong(), any(Pageable.class)))
                .thenReturn(emptyPage);

        // Act
        Page<StockDto> result = stockExchangeService.getAllStocksByExchange(1L, 0, 10, "name");

        // Assert
        assertNotNull(result);
        assertEquals(0, result.getTotalElements());
        assertTrue(result.getContent().isEmpty());

        verify(stockExchangeRepository, times(1)).existsById(1L);
        verify(stockListingRepository, times(1))
                .findStocksByStockExchangeId(anyLong(), any(Pageable.class));
    }

    @Test
    @DisplayName("Should return stocks sorted by specified field")
    void getAllStocksByExchange_WithSorting() {
        // Arrange
        Stock stock2 = new Stock();
        stock2.setStockId(2L);
        stock2.setName("Microsoft Corp.");

        StockDto stockDto2 = new StockDto();
        stockDto2.setStockId(2L);
        stockDto2.setName("Microsoft Corp.");

        List<Stock> stocks = List.of(stock, stock2);
        Page<Stock> stockPage = new PageImpl<>(stocks, PageRequest.of(0, 10), 2);

        when(stockExchangeRepository.existsById(1L)).thenReturn(true);
        when(stockListingRepository.findStocksByStockExchangeId(anyLong(), any(Pageable.class)))
                .thenReturn(stockPage);
        when(stockMapper.map(any(Stock.class)))
                .thenReturn(stockDto)
                .thenReturn(stockDto2);

        // Act
        Page<StockDto> result = stockExchangeService.getAllStocksByExchange(1L, 0, 10, "name");

        // Assert
        assertNotNull(result);
        assertEquals(2, result.getTotalElements());
        assertEquals(2, result.getContent().size());

        verify(stockExchangeRepository, times(1)).existsById(1L);
        verify(stockListingRepository, times(1))
                .findStocksByStockExchangeId(anyLong(), any(Pageable.class));
        verify(stockMapper, times(2)).map(any(Stock.class));
    }

    @Test
    @DisplayName("Should handle pagination correctly")
    void getAllStocksByExchange_Pagination() {
        // Arrange
        List<Stock> stocks = List.of(stock);
        Page<Stock> stockPage = new PageImpl<>(stocks, PageRequest.of(1, 5), 20);

        when(stockExchangeRepository.existsById(1L)).thenReturn(true);
        when(stockListingRepository.findStocksByStockExchangeId(anyLong(), any(Pageable.class)))
                .thenReturn(stockPage);
        when(stockMapper.map(any(Stock.class))).thenReturn(stockDto);

        // Act
        Page<StockDto> result = stockExchangeService.getAllStocksByExchange(1L, 1, 5, "name");

        // Assert
        assertNotNull(result);
        assertEquals(20, result.getTotalElements());
        assertEquals(4, result.getTotalPages());
        assertEquals(1, result.getNumber());
        assertEquals(5, result.getSize());

        verify(stockExchangeRepository, times(1)).existsById(1L);
    }

    // ==================== addStockToStockExchange Tests ====================

    @Test
    @DisplayName("Should add stock to stock exchange successfully")
    void addStockToStockExchange_Success() {
        // Arrange
        when(stockListingRepository.existsById(any(StockListingId.class))).thenReturn(false);
        when(stockExchangeRepository.findById(1L)).thenReturn(Optional.of(stockExchange));
        when(stockRepository.findById(1L)).thenReturn(Optional.of(stock));
        when(stockListingRepository.save(any(StockListing.class))).thenReturn(stockListing);
        when(stockListingRepository.countByStockExchangeId(1L)).thenReturn(5L);
        when(stockExchangeMapper.map(any(StockExchange.class))).thenReturn(stockExchangeDto);
        when(stockMapper.map(any(Stock.class))).thenReturn(stockDto);

        // Act
        StockListingDto result = stockExchangeService.addStockToStockExchange(1L, 1L);

        // Assert
        assertNotNull(result);
        assertNotNull(result.getStockExchangeDto());
        assertNotNull(result.getStockDto());
        assertEquals("NYSE", result.getStockExchangeDto().getName());
        assertEquals("Apple Inc.", result.getStockDto().getName());

        verify(stockListingRepository, times(1)).existsById(any(StockListingId.class));
        verify(stockExchangeRepository, times(1)).findById(1L);
        verify(stockRepository, times(1)).findById(1L);
        verify(stockListingRepository, times(1)).save(any(StockListing.class));
        verify(stockListingRepository, times(1)).countByStockExchangeId(1L);
    }

    @Test
    @DisplayName("Should throw exception when stock already listed")
    void addStockToStockExchange_AlreadyListed() {
        // Arrange
        when(stockListingRepository.existsById(any(StockListingId.class))).thenReturn(true);

        // Act & Assert
        DuplicateResourceException exception = assertThrows(
                DuplicateResourceException.class,
                () -> stockExchangeService.addStockToStockExchange(1L, 1L)
        );

        assertEquals("Stock with id 1 is already listed on Stock Exchange with id 1",
                exception.getMessage());

        verify(stockListingRepository, times(1)).existsById(any(StockListingId.class));
        verify(stockExchangeRepository, never()).findById(anyLong());
        verify(stockRepository, never()).findById(anyLong());
        verify(stockListingRepository, never()).save(any(StockListing.class));
    }

    @Test
    @DisplayName("Should throw exception when stock exchange not found")
    void addStockToStockExchange_ExchangeNotFound() {
        // Arrange
        when(stockListingRepository.existsById(any(StockListingId.class))).thenReturn(false);
        when(stockExchangeRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> stockExchangeService.addStockToStockExchange(999L, 1L)
        );

        assertEquals("Stock Exchange not found with id: 999", exception.getMessage());

        verify(stockListingRepository, times(1)).existsById(any(StockListingId.class));
        verify(stockExchangeRepository, times(1)).findById(999L);
        verify(stockRepository, never()).findById(anyLong());
        verify(stockListingRepository, never()).save(any(StockListing.class));
    }

    @Test
    @DisplayName("Should throw exception when stock not found")
    void addStockToStockExchange_StockNotFound() {
        // Arrange
        when(stockListingRepository.existsById(any(StockListingId.class))).thenReturn(false);
        when(stockExchangeRepository.findById(1L)).thenReturn(Optional.of(stockExchange));
        when(stockRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> stockExchangeService.addStockToStockExchange(1L, 999L)
        );

        assertEquals("Stock not found with id: 999", exception.getMessage());

        verify(stockListingRepository, times(1)).existsById(any(StockListingId.class));
        verify(stockExchangeRepository, times(1)).findById(1L);
        verify(stockRepository, times(1)).findById(999L);
        verify(stockListingRepository, never()).save(any(StockListing.class));
    }

    @Test
    @DisplayName("Should update live market status when adding 10th stock")
    void addStockToStockExchange_UpdateLiveStatusToTrue() {
        // Arrange
        stockExchange.setLiveInMarket(false);

        when(stockListingRepository.existsById(any(StockListingId.class))).thenReturn(false);
        when(stockExchangeRepository.findById(1L)).thenReturn(Optional.of(stockExchange));
        when(stockRepository.findById(1L)).thenReturn(Optional.of(stock));
        when(stockListingRepository.save(any(StockListing.class))).thenReturn(stockListing);
        when(stockListingRepository.countByStockExchangeId(1L)).thenReturn(10L);
        when(stockExchangeMapper.map(any(StockExchange.class))).thenReturn(stockExchangeDto);
        when(stockMapper.map(any(Stock.class))).thenReturn(stockDto);

        // Act
        StockListingDto result = stockExchangeService.addStockToStockExchange(1L, 1L);

        // Assert
        assertNotNull(result);
        assertTrue(stockExchange.isLiveInMarket());
        verify(stockListingRepository, times(1)).countByStockExchangeId(1L);
    }

    @Test
    @DisplayName("Should not change live status when adding stock but count still below 10")
    void addStockToStockExchange_NoLiveStatusChange() {
        // Arrange
        stockExchange.setLiveInMarket(false);

        when(stockListingRepository.existsById(any(StockListingId.class))).thenReturn(false);
        when(stockExchangeRepository.findById(1L)).thenReturn(Optional.of(stockExchange));
        when(stockRepository.findById(1L)).thenReturn(Optional.of(stock));
        when(stockListingRepository.save(any(StockListing.class))).thenReturn(stockListing);
        when(stockListingRepository.countByStockExchangeId(1L)).thenReturn(5L);
        when(stockExchangeMapper.map(any(StockExchange.class))).thenReturn(stockExchangeDto);
        when(stockMapper.map(any(Stock.class))).thenReturn(stockDto);

        // Act
        StockListingDto result = stockExchangeService.addStockToStockExchange(1L, 1L);

        // Assert
        assertNotNull(result);
        assertFalse(stockExchange.isLiveInMarket());
        verify(stockListingRepository, times(1)).countByStockExchangeId(1L);
    }

    // ==================== removeStockFromStockExchange Tests ====================

    @Test
    @DisplayName("Should remove stock from stock exchange successfully")
    void removeStockFromStockExchange_Success() {
        // Arrange
        when(stockExchangeRepository.findById(1L)).thenReturn(Optional.of(stockExchange));
        when(stockListingRepository.findById(any(StockListingId.class)))
                .thenReturn(Optional.of(stockListing));
        doNothing().when(stockListingRepository).delete(any(StockListing.class));
        when(stockListingRepository.countByStockExchangeId(1L)).thenReturn(15L);

        // Act
        stockExchangeService.removeStockFromStockExchange(1L, 1L);

        // Assert
        verify(stockExchangeRepository, times(1)).findById(1L);
        verify(stockListingRepository, times(1)).findById(any(StockListingId.class));
        verify(stockListingRepository, times(1)).delete(stockListing);
        verify(stockListingRepository, times(1)).countByStockExchangeId(1L);
    }

    @Test
    @DisplayName("Should throw exception when stock exchange not found")
    void removeStockFromStockExchange_ExchangeNotFound() {
        // Arrange
        when(stockExchangeRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> stockExchangeService.removeStockFromStockExchange(999L, 1L)
        );

        assertEquals("Stock Exchange not found with id: 999", exception.getMessage());

        verify(stockExchangeRepository, times(1)).findById(999L);
        verify(stockListingRepository, never()).findById(any(StockListingId.class));
        verify(stockListingRepository, never()).delete(any(StockListing.class));
    }

    @Test
    @DisplayName("Should throw exception when stock not listed on exchange")
    void removeStockFromStockExchange_StockNotListed() {
        // Arrange
        when(stockExchangeRepository.findById(1L)).thenReturn(Optional.of(stockExchange));
        when(stockListingRepository.findById(any(StockListingId.class)))
                .thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> stockExchangeService.removeStockFromStockExchange(1L, 1L)
        );

        assertEquals("Stock with id 1 is not listed on this Stock Exchange",
                exception.getMessage());

        verify(stockExchangeRepository, times(1)).findById(1L);
        verify(stockListingRepository, times(1)).findById(any(StockListingId.class));
        verify(stockListingRepository, never()).delete(any(StockListing.class));
    }

    @Test
    @DisplayName("Should update live status to false when stocks fall below 10")
    void removeStockFromStockExchange_UpdateLiveStatusToFalse() {
        // Arrange
        stockExchange.setLiveInMarket(true);

        when(stockExchangeRepository.findById(1L)).thenReturn(Optional.of(stockExchange));
        when(stockListingRepository.findById(any(StockListingId.class)))
                .thenReturn(Optional.of(stockListing));
        doNothing().when(stockListingRepository).delete(any(StockListing.class));
        when(stockListingRepository.countByStockExchangeId(1L)).thenReturn(9L);

        // Act
        stockExchangeService.removeStockFromStockExchange(1L, 1L);

        // Assert
        assertFalse(stockExchange.isLiveInMarket());
        verify(stockListingRepository, times(1)).countByStockExchangeId(1L);
        verify(stockListingRepository, times(1)).delete(stockListing);
    }

    @Test
    @DisplayName("Should not change live status when removing stock but count still >= 10")
    void removeStockFromStockExchange_NoLiveStatusChange() {
        // Arrange
        stockExchange.setLiveInMarket(true);

        when(stockExchangeRepository.findById(1L)).thenReturn(Optional.of(stockExchange));
        when(stockListingRepository.findById(any(StockListingId.class)))
                .thenReturn(Optional.of(stockListing));
        doNothing().when(stockListingRepository).delete(any(StockListing.class));
        when(stockListingRepository.countByStockExchangeId(1L)).thenReturn(10L);

        // Act
        stockExchangeService.removeStockFromStockExchange(1L, 1L);

        // Assert
        assertTrue(stockExchange.isLiveInMarket());
        verify(stockListingRepository, times(1)).countByStockExchangeId(1L);
    }

    @Test
    @DisplayName("Should handle removing last stock from exchange")
    void removeStockFromStockExchange_LastStock() {
        // Arrange
        stockExchange.setLiveInMarket(false);

        when(stockExchangeRepository.findById(1L)).thenReturn(Optional.of(stockExchange));
        when(stockListingRepository.findById(any(StockListingId.class)))
                .thenReturn(Optional.of(stockListing));
        doNothing().when(stockListingRepository).delete(any(StockListing.class));
        when(stockListingRepository.countByStockExchangeId(1L)).thenReturn(0L);

        // Act
        stockExchangeService.removeStockFromStockExchange(1L, 1L);

        // Assert
        assertFalse(stockExchange.isLiveInMarket());
        verify(stockListingRepository, times(1)).delete(stockListing);
    }

    // ==================== updateLiveMarketStatus Tests ====================

    @Test
    @DisplayName("Should set live status to true when stocks >= 10")
    void updateLiveMarketStatus_SetToTrue() {
        // Arrange
        stockExchange.setLiveInMarket(false);
        when(stockListingRepository.countByStockExchangeId(1L)).thenReturn(10L);

        // Act
        stockExchangeService.updateLiveMarketStatus(stockExchange);

        // Assert
        assertTrue(stockExchange.isLiveInMarket());
        verify(stockListingRepository, times(1)).countByStockExchangeId(1L);
    }

    @Test
    @DisplayName("Should set live status to false when stocks < 10")
    void updateLiveMarketStatus_SetToFalse() {
        // Arrange
        stockExchange.setLiveInMarket(true);
        when(stockListingRepository.countByStockExchangeId(1L)).thenReturn(9L);

        // Act
        stockExchangeService.updateLiveMarketStatus(stockExchange);

        // Assert
        assertFalse(stockExchange.isLiveInMarket());
        verify(stockListingRepository, times(1)).countByStockExchangeId(1L);
    }

    @Test
    @DisplayName("Should not change status when already correct (live with 10+ stocks)")
    void updateLiveMarketStatus_NoChangeWhenAlreadyLive() {
        // Arrange
        stockExchange.setLiveInMarket(true);
        when(stockListingRepository.countByStockExchangeId(1L)).thenReturn(15L);

        // Act
        stockExchangeService.updateLiveMarketStatus(stockExchange);

        // Assert
        assertTrue(stockExchange.isLiveInMarket());
        verify(stockListingRepository, times(1)).countByStockExchangeId(1L);
    }

    @Test
    @DisplayName("Should not change status when already correct (not live with < 10 stocks)")
    void updateLiveMarketStatus_NoChangeWhenAlreadyNotLive() {
        // Arrange
        stockExchange.setLiveInMarket(false);
        when(stockListingRepository.countByStockExchangeId(1L)).thenReturn(5L);

        // Act
        stockExchangeService.updateLiveMarketStatus(stockExchange);

        // Assert
        assertFalse(stockExchange.isLiveInMarket());
        verify(stockListingRepository, times(1)).countByStockExchangeId(1L);
    }

    @Test
    @DisplayName("Should handle edge case with exactly 10 stocks")
    void updateLiveMarketStatus_ExactlyTenStocks() {
        // Arrange
        stockExchange.setLiveInMarket(false);
        when(stockListingRepository.countByStockExchangeId(1L)).thenReturn(10L);

        // Act
        stockExchangeService.updateLiveMarketStatus(stockExchange);

        // Assert
        assertTrue(stockExchange.isLiveInMarket());
        verify(stockListingRepository, times(1)).countByStockExchangeId(1L);
    }

    @Test
    @DisplayName("Should handle edge case with zero stocks")
    void updateLiveMarketStatus_ZeroStocks() {
        // Arrange
        stockExchange.setLiveInMarket(true);
        when(stockListingRepository.countByStockExchangeId(1L)).thenReturn(0L);

        // Act
        stockExchangeService.updateLiveMarketStatus(stockExchange);

        // Assert
        assertFalse(stockExchange.isLiveInMarket());
        verify(stockListingRepository, times(1)).countByStockExchangeId(1L);
    }

    @Test
    @DisplayName("Should handle large number of stocks")
    void updateLiveMarketStatus_LargeNumberOfStocks() {
        // Arrange
        stockExchange.setLiveInMarket(false);
        when(stockListingRepository.countByStockExchangeId(1L)).thenReturn(1000L);

        // Act
        stockExchangeService.updateLiveMarketStatus(stockExchange);

        // Assert
        assertTrue(stockExchange.isLiveInMarket());
        verify(stockListingRepository, times(1)).countByStockExchangeId(1L);
    }

    @Test
    @DisplayName("Should handle transition from live to not live")
    void updateLiveMarketStatus_TransitionFromLiveToNotLive() {
        // Arrange
        stockExchange.setLiveInMarket(true);
        when(stockListingRepository.countByStockExchangeId(1L)).thenReturn(3L);

        // Act
        stockExchangeService.updateLiveMarketStatus(stockExchange);

        // Assert
        assertFalse(stockExchange.isLiveInMarket());
        verify(stockListingRepository, times(1)).countByStockExchangeId(1L);
    }
}