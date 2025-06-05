import type { RouteType } from '../types/RouteType';

// props 타입
interface RouteTabsProps {
  activeTab: RouteType; // 현재 선택된 탭 (출근/퇴근 중 하나)
  onTabClick: (tab: RouteType) => void; // 탭을 클릭했을 때 실행할 함수, 클릭된 탭의 RouteType 값을 넘겨줌
}

export default function RouteTabs(props: RouteTabsProps) {
  const activeTab = props.activeTab;
  const onTabClick = props.onTabClick;

  const tabs: RouteType[] = ['출근', '퇴근'];

  return (
    <div className="flex justify-center space-x-4">
      {tabs.map((tab) => {
        // 현재 탭이 선택된 탭인지 확인
        const isSelected = activeTab == tab;

        // 선택 여부에 따라 버튼 스타일 설정
        const buttonClassName = isSelected
        ? 'bg-blue-500 text-white border-blue-500'
        : 'text-blue-500 border-blue-500 hover:bg-blue-50';

        return(
          <button
          key={tab}
          onClick={() => onTabClick(tab)}
          className={`px-6 py-2 border-2 rounded-full text-sm transition-colors ${buttonClassName}`}
        >
          {tab}
        </button>
        );
      })}
    </div>
  );
}