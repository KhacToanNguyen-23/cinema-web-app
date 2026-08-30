package com.cinema.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * [AI UPDATE - Cấu hình hệ thống WebSocket STOMP phục vụ truyền tin Realtime]
 * 
 * - WebSocket: Cung cấp đường truyền 2 chiều liên tục (Full-Duplex) giữa Client và Server.
 * - STOMP: Giao thức định dạng gói tin và quản lý kênh (Topic/Queue Pub-Sub).
 */
@Configuration
@EnableWebSocketMessageBroker // 1. Bật tính năng Message Broker cho WebSocket trong Spring Boot
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    /**
     * Cấu hình "Tổng đài phân luồng tin nhắn" (Message Broker)
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // [LÀN ĐƯỜNG 1: Server -> Client (Broadcast)]
        // Bật Simple In-Memory Broker. Mọi topic bắt đầu bằng "/topic" (ví dụ: "/topic/showtime/1")
        // sẽ là nơi Server phát tin nhắn xuống cho TẤT CẢ các Client đang theo dõi kênh đó.
        registry.enableSimpleBroker("/topic");

        // [LÀN ĐƯỜNG 2: Client -> Server (Request)]
        // Định nghĩa tiền tố cho tin nhắn gửi từ Client lên Server.
        // Khi Client gửi tin nhắn tới "/app/seat.select", Spring sẽ điều hướng tới hàm @MessageMapping("/seat.select") trong Controller.
        registry.setApplicationDestinationPrefixes("/app");
    }

    /**
     * Cấu hình "Cổng bắt tay kết nối ban đầu" (Handshake Endpoint)
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Tạo Endpoint kết nối: ws://localhost:8080/ws (hoặc http://localhost:8080/ws)
        registry.addEndpoint("/ws")
                // Cho phép React (chạy ở localhost:5173 hoặc domain khác) kết nối vào mà không bị lỗi CORS
                .setAllowedOriginPatterns("*")
                // Cơ chế dự phòng SockJS: Tự động chuyển sang HTTP Long-Polling nếu mạng của Client chặn WebSocket thuần
                .withSockJS();
    }
}

