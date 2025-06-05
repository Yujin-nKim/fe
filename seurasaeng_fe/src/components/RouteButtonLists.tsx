import type { Route } from "../types/RouteType";

// props 타입
interface RouteButtonListProps {
  routes: Route[]; //노선ID 리스트
  selectedRouteId: number | null; // 현재 선택된 노선 ID
  onRouteClick: (route: Route) => void; // 노선 버튼을 클릭했을 때 호출할 함수
}

// routes, selectedRouteId, onRouteClick을 props로 받아서 쓰고 있다.
export default function RouteButtonList(props: RouteButtonListProps) {
  const routes = props.routes;
  const selectedRouteId = props.selectedRouteId;
  const onRouteClick = props.onRouteClick;

  return (
    <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
      {routes.map((route) => {

        // 현재 노선 버튼이 선택된 버튼인지 확인
        const isSelected = selectedRouteId === route.id;

        // 선택 여부에 따라 버튼 스타일 설정
        const buttonClassName = isSelected
          ? 'bg-blue-500 text-white border-blue-500'
          : 'text-blue-500 border-blue-500 hover:bg-blue-50';

        return (
           <button
            key={route.id}
            onClick={() => onRouteClick(route)}
            className={`flex-shrink-0 px-6 py-2 border-2 rounded-full text-sm transition-colors ${buttonClassName}`}
          >
            {route.name}
          </button>
        );
      })}
    </div>
  );
}