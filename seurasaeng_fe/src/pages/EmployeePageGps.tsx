import { useState, useEffect, useRef, useMemo } from 'react';
import type { RouteType, RoutesResponse } from '../types/RouteType';
import KakaoMap from '../components/KakaoMap';
import { loadKakaoMapSDK } from '../libs/loadKakaoMap';
import BottomBar from '../components/BottomBar';
import Chatbot from '../components/Chatbot';
import SlideTab from '../components/SlideTab';
import TopBar from '../components/TopBar';
import apiClient from '../libs/axios'; // 네 API 클라이언트 import
import {API} from '../constants/api'; // API 엔드포인트 상수

// TODO: 즐겨찾기 데이터 - API 연동 전 하드코딩
const mockFavoriteRouteIds = {
  출근: 4,
  퇴근: 8,
};

// 위치 정보 포함 노선 목록 조회 API 호출 함수
const fetchRouteData = async (): Promise<RoutesResponse> => {
  const response = await apiClient.get(API.routes.listWithLocation);
  const data = response.data; 

  // 출근/퇴근 분리
  const commuteRoutes = data.filter((item: any) => item.commute === true);
  const offworkRoutes = data.filter((item: any) => item.commute === false);

  // RoutesResponse 형태로 변환
  const formattedRoutes: RoutesResponse = {
    출근: commuteRoutes.map((item: any) => ({
      id: item.id,
      name: item.departureName,
      latitude: item.departureLatitude,
      longitude: item.departureLongitude,
    })),
    퇴근: offworkRoutes.map((item: any) => ({
      id: item.id,
      name: item.destinationName,
      latitude: item.destinationLatitude,
      longitude: item.destinationLongitude,
    })),
  };

  return formattedRoutes;
};

export default function EmployeeGPSApp() {
  const [activeTab, setActiveTab] = useState<RouteType>('출근');
  const [isMapReady, setIsMapReady] = useState(false);
  const [routeData, setRouteData] = useState<RoutesResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const locationTabRef = useRef<HTMLDivElement>(null);
  const selectedBtnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [showChatbot, setShowChatbot] = useState(false);

  // 위치 정보 포함 노선 목록 조회 API 호출
  useEffect(() => {
    fetchRouteData()
      .then((data) => {
        setRouteData(data);
      })
      .catch((error) => {
        console.error('[API 호출 에러] Error fetching route data:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadKakaoMapSDK(() => {
      setIsMapReady(true);
    }).catch((error) => {
      console.error('[Kakao Map 로드 실패] Kakao Maps SDK 로드 실패:', error);
    });
  }, []);

  const routes = routeData ? routeData[activeTab] : [];

  function getFavoriteRouteIndex(tab: RouteType) {
    if (!routeData) return 0;
    const favoriteId = mockFavoriteRouteIds[tab];
    const routes = routeData[tab];
    const index = routes.findIndex(route => route.id === favoriteId);
    return index !== -1 ? index : 0;
  }

  const [locationIdx, setLocationIdx] = useState(0);

  useEffect(() => {
    if (routeData) {
      setLocationIdx(getFavoriteRouteIndex(activeTab));
    }
  }, [routeData, activeTab]);

  const selectedRoute = routes[locationIdx] || null;

  const locations = useMemo(() => {
    if (!routeData) return [];
    const go = routeData["출근"].map((item) => item.name);
    const back = routeData["퇴근"].map((item) => item.name);
    return Array.from(new Set([...go, ...back]));
  }, [routeData]);

  useEffect(() => {
    const btn = selectedBtnRefs.current[locationIdx];
    if (btn && locationTabRef.current) {
      btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [locationIdx]);

  const handleTabClick = (tab: RouteType) => {
    setActiveTab(tab);
    if (routeData) {
      setLocationIdx(getFavoriteRouteIndex(tab));
    }
  };

  const handleChatbotToggle = () => {
    setShowChatbot((v) => !v);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        로딩 중...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfdfe] flex flex-col relative">
      <TopBar title="실시간 셔틀 확인" />
      <div className="pt-16">
        <SlideTab
          locations={locations}
          locationIdx={locationIdx}
          onLocationChange={setLocationIdx}
          tab={activeTab}
          onTabChange={handleTabClick}
          className="w-full"
        />
      </div>
      <div className="flex-1 flex flex-col items-center justify-start pb-24 w-full max-w-xl mx-auto px-4">
        <div className="w-full aspect-square overflow-hidden shadow mb-6 bg-gray-100 flex items-center justify-center">
          {isMapReady && selectedRoute ? (
            <KakaoMap route={selectedRoute} activeTab={activeTab} />
          ) : (
            <div>지도를 불러오는 중입니다...</div>
          )}
        </div>
      </div>
      <button
        onClick={handleChatbotToggle}
        className="fixed bottom-20 right-4 z-30"
        aria-label={showChatbot ? '챗봇 닫기' : '챗봇 열기'}
      >
        <img src="/chat-bubble.png" alt="챗봇" className="w-16 h-16" />
      </button>
      {showChatbot && <Chatbot onClose={() => setShowChatbot(false)} />}
      <BottomBar />
    </div>
  );
}