package com.hicham.annotationplatformproject1.security;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class TokenBlacklist {
    private final Map<String, Date> blacklistedTokens = new ConcurrentHashMap<>();

    public void add(String token, Date expirationDate) {
        blacklistedTokens.put(token, expirationDate);
    }

    public boolean contains(String token) {
        return blacklistedTokens.containsKey(token);
    }

    @Scheduled(fixedRate = 3600000) // Nettoyage toutes les heures
    public void cleanupExpiredTokens() {
        Date now = new Date();
        blacklistedTokens.entrySet().removeIf(entry ->
                entry.getValue().before(now)
        );
    }
}