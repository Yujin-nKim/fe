import { KAKAOMAP_API_KEY, KAKAOMAP_API_BASE_URL } from "../constants/env";

// SDK 로딩 후 kakao.maps.load를 호출
export function loadKakaoMapSDK(callback: () => void): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById('kakao-map-sdk')) {
      resolve();
      kakao.maps.load(callback); 
      return;
    }

    const script = document.createElement("script");
    script.id = "kakao-map-sdk";
    script.src = `${KAKAOMAP_API_BASE_URL}?appkey=${KAKAOMAP_API_KEY}&libraries=services,clusterer,drawing&autoload=false`;
    script.async = true;

    script.onload = () => {
      console.log("Kakao Maps SDK 로드 완료");
      kakao.maps.load(() => {
        console.log("kakao.maps.load() 완료, 지도 준비됨");
        callback();  // 지도 사용할 준비 끝
      });
      resolve();
    };

    script.onerror = () => {
      console.error("Kakao Maps SDK 로드 실패");
      reject(new Error("Kakao Maps SDK 로드 실패"));
    };

    document.head.appendChild(script);
  });
}