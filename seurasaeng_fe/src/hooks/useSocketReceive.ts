import { useEffect, useRef, useState } from 'react';
import { Client, type StompSubscription } from '@stomp/stompjs';
import { SOCKET_URL } from '../constants/env';
import { API } from '../constants/api';

// 수신받는 GPS 데이터 타입
export interface GpsData {
  latitude: number;
  longitude: number;
}

// 서버에서 오는 메시지 타입 
export type ServerMessage =
  | {
      type: "RUNNING";
      routeId: number;
      latitude: number;
      longitude: number;
      timestamp: string;
    }
  | {
      type: "END";
      timestamp: string;
    };

export default function useWebSocket(routeId: number | null) {
  const [gpsData, setGpsData] = useState<GpsData | null>(null);
  const [isOperating, setIsOperating] = useState<boolean>(false);
  const clientRef = useRef<Client | null>(null);

  const subscriptionRef = useRef<StompSubscription | null>(null);
  const retryCountRef = useRef<number>(0);
  const MAX_RETRY = 5;

  const connect = () => {
    const token = localStorage.getItem('accessToken');

    const client = new Client({
      brokerURL: SOCKET_URL,
      reconnectDelay: 0,

      connectHeaders: {
          Authorization: `Bearer ${token}`, 
        },

      onConnect: () => {
        console.log("WebSocket 연결됨");
        retryCountRef.current = 0;
        if (routeId !== null) {
          subscribeRoute(routeId);
        }
      },


      onWebSocketClose: () => {
        console.warn("WebSocket 연결 끊김");
        if (retryCountRef.current < MAX_RETRY) {
          retryCountRef.current += 1;
          console.log(`재연결 시도 (${retryCountRef.current}/${MAX_RETRY})`);
          setTimeout(connect, 2000);
        } else {
          console.error("재연결 시도 초과");
          setIsOperating(false);
          setGpsData(null);
        }
      },


      onStompError: (frame) => {
        console.error("STOMP 오류", frame);
      },
    });

    client.activate();
    clientRef.current = client;
  };

  const subscribeRoute = (routeId: number) => {
    if (!clientRef.current) return;

    const topic = API.websocket.topic(String(routeId));

    subscriptionRef.current?.unsubscribe();

    const subscription = clientRef.current.subscribe(topic, (message) => {
      const data: ServerMessage = JSON.parse(message.body);
      console.log("수신된 메시지:", data);

      if (data.type === "END") {
        console.log("운행 종료:", data.timestamp);
        setGpsData(null);
        setIsOperating(false);
      } else if (data.type === "RUNNING") {
        setGpsData({
          latitude: data.latitude,
          longitude: data.longitude,
        });
        setIsOperating(true);
      }
    });

    subscriptionRef.current = subscription;
  };

  useEffect(() => {
    connect();

    return () => {
      clientRef.current?.deactivate();
      console.log("소켓 연결 해제");
    };
  }, []);

  useEffect(() => {
    if (!clientRef.current || !clientRef.current.connected) return;

    setGpsData(null);

    subscriptionRef.current?.unsubscribe();
    console.log("소켓 구독 해제");
    if (routeId !== null) {
      subscribeRoute(routeId);
    }
  }, [routeId]);

  return { gpsData, isOperating };
}