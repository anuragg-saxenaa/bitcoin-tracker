package com.bitcointracker.controller;

import com.bitcointracker.dto.BitcoinPriceResponse;
import com.bitcointracker.service.BitcoinService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bitcoin")
@CrossOrigin(origins = "http://localhost:3000")
public class BitcoinController {
    
    @Autowired
    private BitcoinService bitcoinService;
    
    @GetMapping("/price")
    public ResponseEntity<BitcoinPriceResponse> getCurrentPrice() {
        try {
            BitcoinPriceResponse currentPrice = bitcoinService.getCurrentPrice();
            return ResponseEntity.ok(currentPrice);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/history")
    public ResponseEntity<List<BitcoinPriceResponse>> getPriceHistory(
            @RequestParam(defaultValue = "24") int hours) {
        try {
            List<BitcoinPriceResponse> priceHistory = bitcoinService.getPriceHistory(hours);
            return ResponseEntity.ok(priceHistory);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Bitcoin Tracker API is running!");
    }
} 