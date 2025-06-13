package com.bitcointracker.service;

import com.bitcointracker.dto.BitcoinPriceResponse;
import com.bitcointracker.model.BitcoinPrice;
import com.bitcointracker.repository.BitcoinPriceRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BitcoinService {
    
    private static final String COINGECKO_API_URL = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true";
    
    @Autowired
    private BitcoinPriceRepository bitcoinPriceRepository;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    public BitcoinPriceResponse getCurrentPrice() {
        Optional<BitcoinPrice> latestPrice = bitcoinPriceRepository.findTopByOrderByTimestampDesc();
        if (latestPrice.isPresent()) {
            BitcoinPrice price = latestPrice.get();
            return new BitcoinPriceResponse(
                price.getPrice(),
                price.getMarketCap(),
                price.getVolume24h(),
                price.getChange24h(),
                price.getTimestamp()
            );
        }
        return fetchAndSaveCurrentPrice();
    }
    
    public List<BitcoinPriceResponse> getPriceHistory(int hours) {
        LocalDateTime startTime = LocalDateTime.now().minusHours(hours);
        List<BitcoinPrice> prices = bitcoinPriceRepository.findPricesAfter(startTime);
        
        return prices.stream()
            .map(price -> new BitcoinPriceResponse(
                price.getPrice(),
                price.getMarketCap(),
                price.getVolume24h(),
                price.getChange24h(),
                price.getTimestamp()
            ))
            .collect(Collectors.toList());
    }
    
    @Scheduled(fixedRate = 30000) // Fetch every 30 seconds
    public void scheduledPriceUpdate() {
        try {
            BitcoinPriceResponse newPrice = fetchAndSaveCurrentPrice();
            // Send real-time update via WebSocket
            messagingTemplate.convertAndSend("/topic/bitcoin-price", newPrice);
        } catch (Exception e) {
            System.err.println("Error fetching Bitcoin price: " + e.getMessage());
        }
    }
    
    private BitcoinPriceResponse fetchAndSaveCurrentPrice() {
        try {
            String response = restTemplate.getForObject(COINGECKO_API_URL, String.class);
            JsonNode jsonNode = objectMapper.readTree(response);
            JsonNode bitcoinData = jsonNode.get("bitcoin");
            
            BigDecimal price = new BigDecimal(bitcoinData.get("usd").asText());
            BigDecimal marketCap = new BigDecimal(bitcoinData.get("usd_market_cap").asText());
            BigDecimal volume24h = new BigDecimal(bitcoinData.get("usd_24h_vol").asText());
            BigDecimal change24h = new BigDecimal(bitcoinData.get("usd_24h_change").asText());
            LocalDateTime timestamp = LocalDateTime.now();
            
            BitcoinPrice bitcoinPrice = new BitcoinPrice(price, marketCap, volume24h, change24h, timestamp);
            bitcoinPriceRepository.save(bitcoinPrice);
            
            return new BitcoinPriceResponse(price, marketCap, volume24h, change24h, timestamp);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch Bitcoin price", e);
        }
    }
} 