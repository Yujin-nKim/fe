import { useRef, useCallback } from "react";
import { Client, type IMessage } from "@stomp/stompjs";
// import SockJS from "sockjs-client";
import { SOCKET_URL } from "../constants/env";

// Socket disconnect 여부 저장하는 변수
let manualDisconnect = false; 

// 커스텀 훅이 반환할 타입 정의
interface UseSocketReturn {
  stompClientRef: React.MutableRefObject<Client | null>; // 현재 WebSocket 클라이언트 인스턴스
  connectSocket: () => Promise<void>; // WebSocket 연결 함수
  disconnectSocket: () => void; // WebSocket 연결 종료 함수
};

// WebSocket 연결을 관리하는 커스텀 훅
export function useSocket(onMaxRetryExceeded?: () => void): UseSocketReturn {

  const stompClientRef = useRef<Client | null>(null); // WebSocket 클라이언트를 저장
  const retryCountRef = useRef(0); // 재연결 시도 횟수 저장
  const MAX_RETRY = 5; // 최대 재연결 시도 횟수

  // WebSocket 연결 함수
  const connectSocket = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      manualDisconnect = false; // 새 연결 시작 시 수동 disconnect 플래그 초기화

      const token = localStorage.getItem("accessToken");

      if (!token) {
        console.error("토큰이 없습니다.");
        reject(new Error("No token"));
        return;
      }
      
      const client = new Client({
        brokerURL: SOCKET_URL,
        reconnectDelay: 0,
        debug: (msg) => console.log("[STOMP]", msg),

        connectHeaders: {
          Authorization: `Bearer ${token}`, 
        },

        // WebSocket 연결 성공 시
        onConnect: () => {
          console.log("WebSocket 연결 성공");
          retryCountRef.current = 0; // 재연결 시도 횟수 초기화

                    // ✅ 커스텀 에러 채널 구독 추가
          client.subscribe("/queue/errors", (message: IMessage) => {
            const errorMessage = message.body;
            console.error("서버에서 받은 WebSocket 에러:", errorMessage);
            alert(`에러 발생: ${errorMessage}`);
          });


          resolve(); // 연결 성공: Promise 성공 처리
        },

        // WebSocket 연결 종료 시
        onWebSocketClose: () => {
          console.warn("WebSocket 연결 종료 감지");

          if (manualDisconnect) {
            console.log("수동 종료로 재연결 시도 안 함");
            return; // 수동 disconnect일 경우 재연결 안 함
          }

          if (retryCountRef.current < MAX_RETRY) {
            retryCountRef.current += 1;
            console.log(`재연결 시도 (${retryCountRef.current}/${MAX_RETRY})`);
            setTimeout(() => connectSocket().catch(() => {}), 2000);
          } else {
            console.error("최대 재연결 시도 초과");

            onMaxRetryExceeded?.();

            alert("네트워크 오류: 다시 연결할 수 없습니다. 페이지를 새로고침 해주세요.");
            reject(new Error("최대 재연결 시도 초과"));
            
          }
        },
        onStompError: (frame) => {
          console.error("STOMP 오류", frame);
        },
      });

      client.activate();
      stompClientRef.current = client;
    });
  }, []);

  // WebSocket 연결 종료 함수
  const disconnectSocket = useCallback(() => {
    manualDisconnect = true; 
    stompClientRef.current?.deactivate();
    stompClientRef.current = null;
    console.log("WebSocket 연결 종료");
  }, []);

  return { stompClientRef, connectSocket, disconnectSocket };
}