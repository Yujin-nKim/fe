import { useState, useCallback, useRef } from "react";

interface Location {
  latitude: number;
  longitude: number;
};

// 훅이 반환할 타입 정의
interface UseGeoLocationReturn {
  location: Location | null; // 현재 위치 (없으면 null)
  error: string | null; // 에러 메시지 (없으면 null)
  isLoading: boolean; // 로딩 중 여부
  fetchLocation: () => void; // 위치 가져오기 함수
};

// GPS 위치를 가져오는 커스텀 훅
export function useGeoLocation(): UseGeoLocationReturn {
  // 위치 정보 상태 (초기값: null)
  const [location, setLocation] = useState<Location | null>(null);
  // 에러 상태 (초기값: null)
  const [error, setError] = useState<string | null>(null);
  // 로딩 중인지 여부 상태 (초기값: false)
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // 재시도 횟수 저장 (화면 렌더링과 무관하므로 useRef 사용)
  const retryRef = useRef(0);
  // 최대 재시도 횟수
  const MAX_RETRY = 5;

  // 위치 정보를 가져오는 함수
  const fetchLocation = useCallback(() => {
    // 브라우저가 Geolocation API를 지원하지 않는 경우
    if (!navigator.geolocation) {
      setError("Geolocation 지원되지 않음");
      return;
    }

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(

      // 성공
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLoading(false);
        retryRef.current = 0; // 성공 시 재시도 카운트 초기화
      },

      // 실패
      (err) => {
        console.error("GPS 에러", err.message);

        if (retryRef.current < MAX_RETRY) {
          retryRef.current += 1;
          console.log(`GPS 재시도 (${retryRef.current}/${MAX_RETRY})`);
          fetchLocation();
        } else {
          setError(`GPS 위치 정보를 가져오는데 실패했습니다: ${err.message}`);
          setIsLoading(false);
        }
      }
    );
  }, []);

  return { location, error, isLoading, fetchLocation };
}