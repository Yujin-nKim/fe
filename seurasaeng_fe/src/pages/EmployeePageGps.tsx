import { useState, useEffect } from 'react';
import type { RouteType, Route, RoutesResponse } from '../types/RouteType';
import RouteTabs from '../components/RouteTabs';
import RouteButtonList from '../components/RouteButtonLists';
import KakaoMap from '../components/KakaoMap';
import { loadKakaoMapSDK } from '../libs/loadKakaoMap';


// TODO: 테스트용 노선 데이터  - API 연동 후 실제 데이터로 교체할 것
/**
 * 테스트용 노선 데이터
 * 
 * API 연동 전까지 임시로 사용되는 데이터
 * 
 */
const mockRouteData: RoutesResponse = {
  출근: [
    { id: 1, name: '청사' , latitude: 37.4254, longitude: 126.9892},
    { id: 2, name: '양재', latitude: 37.4837, longitude: 127.0354},
    { id: 3, name: '사당', latitude: 37.4754 , longitude: 126.9814},
    { id: 4, name: '이수', latitude: 37.4854 , longitude: 126.9821},
    { id: 5, name: '금정', latitude: 37.3716 , longitude: 126.9435},
  ],
  퇴근: [
    { id: 6, name: '청사',  latitude: 37.4254, longitude: 126.9892},
    { id: 7, name: '양재', latitude: 37.4837, longitude: 127.0354},
    { id: 8, name: '사당', latitude: 37.4754 , longitude: 126.9814},
    { id: 9, name: '이수', latitude: 37.4854 , longitude: 126.9821},
    { id: 10, name: '금정', latitude: 37.3716 , longitude: 126.9435},
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

export default function EmployeeGPSApp() {

    /** 현재 선택된 탭 상태 */
    const[activeTab, setActiveTab] = useState<RouteType>('출근');
    /** 현재 선택된 노선의 ID */
    const[selectedRouteId, setSelectedRouteId] = useState(mockFavoriteRouteIds['출근']);
    /** 현재 활성화된 탭에 따른 노선 리스트 */
    const routes = mockRouteData[activeTab];
    /** 현재 선택된 노선 객체 */
    const selectedRoute = routes.find(route => route.id === selectedRouteId) || null;

    const [isMapReady, setIsMapReady] = useState(false);

    useEffect(() => {
    loadKakaoMapSDK(() => {
      setIsMapReady(true);
    }).catch((error) => {
      console.error('Kakao Maps SDK 로드 실패:', error);
    });
  }, []);

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

    /**
     * 노선 클릭 시 호출되는 핸들러
     * 
     * @param route - 선택된 노선 정보
     * @description 선택한 노선의 ID를 상태에 저장하고, 콘솔에 출력
     */
    const handleRouteClick = (route:Route) => {
        setSelectedRouteId(route.id);
        console.log('선택된 노선 ID: ', route.id);
    }

    return(
    <div className="w-full max-w-xl mx-auto px-4 py-6 space-y-6">

      {/* 노선 버튼 영역 */}
      <RouteButtonList
        routes={routes}
        selectedRouteId={selectedRouteId}
        onRouteClick={handleRouteClick}
      />

      {/* 출근 / 퇴근 탭 버튼 영역 */}
      <RouteTabs activeTab={activeTab} onTabClick={handleTabClick} />

      {/* 지도 영역: SDK 로드가 완료되었을 때만 렌더링 */}
      {isMapReady ? (
        <KakaoMap route={selectedRoute} activeTab={activeTab} />
      ) : (
        <div>지도를 불러오는 중입니다...</div>
      )}
    </div>
    );
}