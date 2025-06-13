package com.bitcointracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BitcoinTrackerApplication {

    public static void main(String[] args) {
        SpringApplication.run(BitcoinTrackerApplication.class, args);
    }
} 