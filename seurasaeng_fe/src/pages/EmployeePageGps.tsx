import { useState, useEffect, useRef } from 'react';
import type { RouteType, RoutesResponse } from '../types/RouteType';
import KakaoMap from '../components/KakaoMap';
import { loadKakaoMapSDK } from '../libs/loadKakaoMap';
import BottomBar from '../components/BottomBar';
import Chatbot from '../components/Chatbot';
import { useNavigate } from 'react-router-dom';
import SlideTab from '../components/SlideTab';

// TODO: 테스트용 노선 데이터  - API 연동 후 실제 데이터로 교체할 것
/**
 * 테스트용 노선 데이터
 * 
 * API 연동 전까지 임시로 사용되는 데이터
 * 
 */
const mockRouteData: RoutesResponse = {
  출근: [
    { id: 1, name: '정부과천청사역' , latitude: 37.4254, longitude: 126.9892},
    { id: 2, name: '양재역', latitude: 37.4837, longitude: 127.0354},
    { id: 3, name: '사당역', latitude: 37.4754 , longitude: 126.9814},
    { id: 4, name: '이수역', latitude: 37.4854 , longitude: 126.9821},
    { id: 5, name: '금정역', latitude: 37.3716 , longitude: 126.9435},
  ],
  퇴근: [
    { id: 6, name: '정부과천청사역',  latitude: 37.4254, longitude: 126.9892},
    { id: 7, name: '양재역', latitude: 37.4837, longitude: 127.0354},
    { id: 8, name: '사당역', latitude: 37.4754 , longitude: 126.9814},
    { id: 9, name: '이수역', latitude: 37.4854 , longitude: 126.9821},
    { id: 10, name: '금정역', latitude: 37.3716 , longitude: 126.9435},
  ],
};

// TODO: 테스트용 즐겨찾기 데이터  - API 연동 후 실제 데이터로 교체할 것
/**
 * 테스트용 즐겨찾기 데이터
 * 
 * API 연동 전까지 임시로 사용되는 데이터
 * 
 */
const mockFavoriteRouteIds = {
  출근: 4,
  퇴근: 9,
};

const getLocations = () => {
  const go = mockRouteData["출근"].map((item) => item.name);
  const back = mockRouteData["퇴근"].map((item) => item.name);
  return Array.from(new Set([...go, ...back]));
};

const LOCATIONS = getLocations();

export default function EmployeeGPSApp() {
  const [activeTab, setActiveTab] = useState<RouteType>('출근');
  const [selectedRouteId, setSelectedRouteId] = useState(mockFavoriteRouteIds['출근']);
  const routes = mockRouteData[activeTab];
  const selectedRoute = routes.find(route => route.id === selectedRouteId) || null;
  const [isMapReady, setIsMapReady] = useState(false);
  const [locationIdx, setLocationIdx] = useState(0);
  const locationTabRef = useRef<HTMLDivElement>(null);
  const selectedBtnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [showChatbot, setShowChatbot] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadKakaoMapSDK(() => {
      setIsMapReady(true);
    }).catch((error) => {
      console.error('Kakao Maps SDK 로드 실패:', error);
    });
  }, []);

  useEffect(() => {
    const btn = selectedBtnRefs.current[locationIdx];
    if (btn && locationTabRef.current) {
      btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [locationIdx]);

  // 디자인용: 현재 탑승 인원 mock
  const currentCount = 10;
  const maxCount = 45;

  // 색상 결정 함수 (QrScanPage와 동일)
  const getCountColor = (count: number) => {
    if (count <= 15) return 'text-green-600';
    if (count <= 30) return 'text-orange-500';
    return 'text-red-600';
  };

  /**
   * 탭 클릭 시 호출되는 핸들러
   *  
   * @param tab - 선택된 탭 ('출근' | '퇴근')
   * @description 선택한 탭을 활성화하고, 선택된 노선 ID를  즐겨찾기 ID로 활성화
   */
  const handleTabClick = (tab:RouteType) => {
    setActiveTab(tab);
    setSelectedRouteId(mockFavoriteRouteIds[tab]);
  }

  const handleChatbotToggle = () => {
    setShowChatbot((v) => !v);
  };

  return (
    <div className="min-h-screen bg-[#fdfdfe] flex flex-col relative">
      {/* 상단바 */}
      <div className="fixed left-0 top-0 right-0 z-20 flex items-center h-14 px-4 border-b border-gray-100 bg-[#5382E0]">
        <button className="absolute left-4" onClick={() => navigate(-1)}>
          <img src="/back.png" alt="뒤로가기" className="w-6 h-6 invert brightness-0" />
        </button>
        <div className="flex-1 text-center font-semibold text-lg text-white">실시간 셔틀 확인</div>
      </div>
      {/* SlideTab 부모 div을 시간표 페이지와 동일하게 */}
      <div className="pt-16">
        <SlideTab
          locations={LOCATIONS}
          locationIdx={locationIdx}
          onLocationChange={setLocationIdx}
          tab={activeTab}
          onTabChange={handleTabClick}
          className="w-full"
        />
      </div>
      {/* 지도 영역, 탑승 인원 등 기존 코드 유지 */}
      <div className="flex-1 flex flex-col items-center justify-start pb-24 w-full max-w-xl mx-auto px-4">
        <div className="w-full aspect-square overflow-hidden shadow mb-6 bg-gray-100 flex items-center justify-center">
          {isMapReady ? (
            <KakaoMap route={selectedRoute} activeTab={activeTab} />
          ) : (
            <div>지도를 불러오는 중입니다...</div>
          )}
        </div>
        <div className="w-full text-center text-base font-bold mb-2">
          현재 탑승인원 : <span className={getCountColor(currentCount)}>{currentCount}</span> / {maxCount}
        </div>
      </div>
      {/* 오른쪽 아래 챗봇 버튼 */}
      <button
        onClick={handleChatbotToggle}
        className="fixed bottom-20 right-4 z-30"
        aria-label={showChatbot ? '챗봇 닫기' : '챗봇 열기'}
      >
        <img src="/chat-bubble.png" alt="챗봇" className="w-16 h-16" />
      </button>
      {showChatbot && <Chatbot onClose={() => setShowChatbot(false)} />}
      {/* 하단바 */}
      <BottomBar />
    </div>
  );
}