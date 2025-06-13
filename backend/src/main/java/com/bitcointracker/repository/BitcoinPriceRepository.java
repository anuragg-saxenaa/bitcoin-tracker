package com.bitcointracker.repository;

import com.bitcointracker.model.BitcoinPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BitcoinPriceRepository extends JpaRepository<BitcoinPrice, Long> {
    
    Optional<BitcoinPrice> findTopByOrderByTimestampDesc();
    
    @Query("SELECT bp FROM BitcoinPrice bp WHERE bp.timestamp >= :startTime ORDER BY bp.timestamp ASC")
    List<BitcoinPrice> findPricesAfter(@Param("startTime") LocalDateTime startTime);
    
    @Query("SELECT bp FROM BitcoinPrice bp WHERE bp.timestamp >= :startTime AND bp.timestamp <= :endTime ORDER BY bp.timestamp ASC")
    List<BitcoinPrice> findPricesBetween(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);
} 