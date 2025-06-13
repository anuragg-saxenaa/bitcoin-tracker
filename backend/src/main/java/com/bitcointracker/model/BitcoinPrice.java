package com.bitcointracker.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bitcoin_prices")
public class BitcoinPrice {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal price;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal marketCap;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal volume24h;
    
    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal change24h;
    
    @Column(nullable = false)
    private LocalDateTime timestamp;
    
    public BitcoinPrice() {}
    
    public BitcoinPrice(BigDecimal price, BigDecimal marketCap, BigDecimal volume24h, BigDecimal change24h, LocalDateTime timestamp) {
        this.price = price;
        this.marketCap = marketCap;
        this.volume24h = volume24h;
        this.change24h = change24h;
        this.timestamp = timestamp;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
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