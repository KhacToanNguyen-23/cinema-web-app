import { useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

/**
 * Hook quan ly ket noi WebSocket STOMP cho trang thai ghe Realtime
 *
 * @param {number|string} showtimeId - ID cua suat chieu dang xem
 * @param {function} onSeatMessageReceived - Callback khi nhan duoc su kien doi trang thai ghe tu Server
 * @param {object} currentUser - Thong tin nguoi dung hien tai
 */
export const useSeatWebSocket = (showtimeId, onSeatMessageReceived, currentUser) => {
  const stompClientRef = useRef(null);

  useEffect(() => {
    if (!showtimeId) return;

    // [AI UPDATE - Su dung bien moi truong VITE_WS_BASE_URL thay vi hardcode localhost]
    const wsUrl = import.meta.env.VITE_WS_BASE_URL || 'http://localhost:8080/ws';
    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      reconnectDelay: 5000, // Tu dong ket noi lai sau 5s neu mat ket noi
      debug: () => {
        // Co the mo log debug khi can kiem tra chi tiet
      },
    });

    // Xu ly khi ket noi thanh cong
    client.onConnect = () => {
      console.log(`[WebSocket] Connected successfully. Subscribing to showtime #${showtimeId}`);

      // Dang ky lang nghe kenh cua suat chieu tuong ung
      client.subscribe(`/topic/showtime/${showtimeId}`, (message) => {
        if (message.body) {
          try {
            const seatEvent = JSON.parse(message.body);
            console.log('[WebSocket] Received seat event:', seatEvent);

            if (onSeatMessageReceived) {
              onSeatMessageReceived(seatEvent);
            }
          } catch (err) {
            console.error('[WebSocket] Failed to parse message body:', err);
          }
        }
      });
    };

    // Xu ly khi co loi STOMP
    client.onStompError = (frame) => {
      console.error('[WebSocket Error] Message:', frame.headers['message'], 'Body:', frame.body);
    };

    // Kich hoat ket noi
    client.activate();
    stompClientRef.current = client;

    // Ngat ket noi khi unmount component
    return () => {
      if (client) {
        console.log(`[WebSocket] Disconnecting from showtime #${showtimeId}`);
        client.deactivate();
      }
    };
  }, [showtimeId, onSeatMessageReceived]);

  /**
   * Ham gui su kien thao tac ghe len Server
   *
   * @param {number} seatId - ID cua ghe
   * @param {string} seatName - Ten ghe (VD: A1, H8)
   * @param {string} status - Trang thai: HOLDING, AVAILABLE, BOOKED
   */
  const sendSeatAction = useCallback(
    (seatId, seatName, status) => {
      if (stompClientRef.current && stompClientRef.current.connected) {
        const payload = {
          showtimeId: Number(showtimeId),
          seatId: Number(seatId),
          seatName: seatName,
          userId: currentUser?.id || 1,
          status: status,
        };

        stompClientRef.current.publish({
          destination: '/app/seat.select',
          body: JSON.stringify(payload),
        });

        console.log('[WebSocket] Sent seat action:', payload);
      } else {
        console.warn('[WebSocket] Cannot send action. Client is not connected.');
      }
    },
    [showtimeId, currentUser]
  );

  return { sendSeatAction };
};
