import type { RouteType } from './RouteType';

export interface BottomBarProps {
  transform?: string;
  transition?: string;
}

export interface MyPageDrawerProps {
  open: boolean;
  onClose: () => void;
  onDrag: (x: number) => void;
}

export interface KakaoMapProps {
  route: {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
  } | null;
  activeTab: RouteType;
}

export interface OperationButtonsProps {
  onStart: () => void;
  onEnd: () => void;
  onQrScan: () => void;
  isStartDisabled: boolean;
  isEndDisabled: boolean;
  isQrDisabled: boolean;
}

export interface PopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  dontShowTodayHandler: () => void;
  goToNoticeHandler: () => void;
}

export interface RouteButtonListProps {
  routes: { id: number; name: string }[];
  selectedRouteId: number;
  onRouteSelect: (id: number) => void;
}

export interface RouteTabsProps {
  activeTab: RouteType;
  onTabClick: (tab: RouteType) => void;
}

export interface SlideTabProps {
  locations: string[];
  locationIdx: number;
  onLocationChange: (idx: number) => void;
  tab: RouteType;
  onTabChange: (tab: RouteType) => void;
  className?: string;
}

export interface TopBarProps {
  title: string;
  rightContent?: React.ReactNode;
  bgColorClass?: string;
}
