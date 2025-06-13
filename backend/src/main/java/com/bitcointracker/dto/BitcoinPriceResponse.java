package com.bitcointracker.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BitcoinPriceResponse {
    private BigDecimal price;
    private BigDecimal marketCap;
    private BigDecimal volume24h;
    private BigDecimal change24h;
    private LocalDateTime timestamp;
    
    public BitcoinPriceResponse() {}
    
    public BitcoinPriceResponse(BigDecimal price, BigDecimal marketCap, BigDecimal volume24h, BigDecimal change24h, LocalDateTime timestamp) {
        this.price = price;
        this.marketCap = marketCap;
        this.volume24h = volume24h;
        this.change24h = change24h;
        this.timestamp = timestamp;
    }
    
    // Getters and Setters
    public BigDecimal getPrice() {
        return price;
    }
    
    public void setPrice(BigDecimal price) {
        this.price = price;
    }
    
    public BigDecimal getMarketCap() {
        return marketCap;
    }
    
    public void setMarketCap(BigDecimal marketCap) {
        this.marketCap = marketCap;
    }
    
    public BigDecimal getVolume24h() {
        return volume24h;
    }
    
    public void setVolume24h(BigDecimal volume24h) {
        this.volume24h = volume24h;
    }
    
    public BigDecimal getChange24h() {
        return change24h;
    }
    
    public void setChange24h(BigDecimal change24h) {
        this.change24h = change24h;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
} 