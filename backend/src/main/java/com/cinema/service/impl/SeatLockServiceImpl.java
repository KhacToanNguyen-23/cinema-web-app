package com.cinema.service.impl;

import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.cinema.service.SeatLockService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * [AI UPDATE - Implement Service khoa ghe bang Redis Distributed Lock SETNX]
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SeatLockServiceImpl implements SeatLockService {

    private final RedisTemplate<String, Object> redisTemplate;

    private static final long HOLD_DURATION_SECONDS = 300; // 5 phut (300 giay)

    private String buildLockKey(Long showtimeId, Long seatId) {
        return "lock:showtime:" + showtimeId + ":seat:" + seatId;
    }

    @Override
    public boolean tryHoldSeat(Long showtimeId, Long seatId, Long userId) {
        String key = buildLockKey(showtimeId, seatId);

        // Lenh SETNX + EX: Chi set neu key chua ton tai, tu dong het han sau 300s
        Boolean success = redisTemplate.opsForValue().setIfAbsent(key, userId, HOLD_DURATION_SECONDS, TimeUnit.SECONDS);

        if (Boolean.TRUE.equals(success)) {
            log.info("[REDIS_LOCK_SUCCESS] showtimeId={} seatId={} userId={} ttl={}s",
                    showtimeId, seatId, userId, HOLD_DURATION_SECONDS);
            return true;
        } else {
            // Neu chinh user do dang giu thi van tra ve true (re-lock)
            Object currentHolder = redisTemplate.opsForValue().get(key);
            if (currentHolder != null && currentHolder.toString().equals(String.valueOf(userId))) {
                log.info("[REDIS_LOCK_RENEW] Seat already held by same user: showtimeId={} seatId={} userId={}",
                        showtimeId, seatId, userId);
                return true;
            }
            log.warn("[REDIS_LOCK_REJECTED] Seat already held by another user: showtimeId={} seatId={} requestedUser={} currentHolder={}",
                    showtimeId, seatId, userId, currentHolder);
            return false;
        }
    }

    @Override
    public boolean releaseSeat(Long showtimeId, Long seatId, Long userId) {
        String key = buildLockKey(showtimeId, seatId);
        Object currentHolder = redisTemplate.opsForValue().get(key);

        if (currentHolder != null) {
            // Chi nguoi dang giu (hoac Admin/Staff) moi duoc quyen huy
            if (currentHolder.toString().equals(String.valueOf(userId))) {
                redisTemplate.delete(key);
                log.info("[REDIS_LOCK_RELEASED] showtimeId={} seatId={} userId={}", showtimeId, seatId, userId);
                return true;
            } else {
                log.warn("[REDIS_RELEASE_DENIED] User {} tried to release seat held by {}", userId, currentHolder);
                return false;
            }
        }
        return true;
    }

    @Override
    public boolean isSeatLocked(Long showtimeId, Long seatId) {
        String key = buildLockKey(showtimeId, seatId);
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }

    @Override
    public Long getLockedUserId(Long showtimeId, Long seatId) {
        String key = buildLockKey(showtimeId, seatId);
        Object val = redisTemplate.opsForValue().get(key);
        if (val != null) {
            try {
                return Long.parseLong(val.toString());
            } catch (NumberFormatException e) {
                return null;
            }
        }
        return null;
    }

    @Override
    public Long getRemainingHoldSeconds(Long showtimeId, Long seatId) {
        String key = buildLockKey(showtimeId, seatId);
        Long expire = redisTemplate.getExpire(key, TimeUnit.SECONDS);
        return expire != null && expire > 0 ? expire : 0L;
    }

    @Override
    public Set<Long> getLockedSeatIds(Long showtimeId) {
        String pattern = "lock:showtime:" + showtimeId + ":seat:*";
        Set<String> keys = redisTemplate.keys(pattern);
        Set<Long> seatIds = new HashSet<>();

        if (keys != null) {
            for (String k : keys) {
                try {
                    String[] parts = k.split(":");
                    Long sId = Long.parseLong(parts[parts.length - 1]);
                    seatIds.add(sId);
                } catch (Exception ignored) {
                }
            }
        }
        return seatIds;
    }
}