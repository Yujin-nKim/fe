import React, { useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';

interface MyPageDrawerProps {
  open: boolean;
  onClose: () => void;
  onDrag: (dragX: number) => void;
}

const DRAG_CLOSE_THRESHOLD = 80; // px
const MAX_OVERLAY_OPACITY = 0.18;

const MyPageDrawer: React.FC<MyPageDrawerProps> = ({ open, onClose, onDrag }) => {
  const startX = useRef<number | null>(null);
  const [dragX, setDragX] = useState(0);
  const navigate = useNavigate();

  // 드로어 열린 정도에 따라 오버레이 투명도 동적 계산
  const overlayOpacity = open
    ? MAX_OVERLAY_OPACITY * (1 - dragX / window.innerWidth) // 화면 너비를 기준으로 투명도 계산
    : 0;

  // 터치 시작
  const handleDragStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  // 터치 이동
  const handleDragMove = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    const clientX = e.touches[0].clientX;
    const deltaX = clientX - startX.current;
    if (deltaX > 0) {
      setDragX(deltaX);
      onDrag(deltaX);
    }
  };

  // 터치 끝
  const handleDragEnd = () => {
    if (dragX > DRAG_CLOSE_THRESHOLD) {
      onClose();
      // 히스토리에서 가짜 스택 제거
      if (window.history.state && window.history.state.drawer) {
        window.history.back();
      }
    }
    setDragX(0);
    onDrag(0);
    startX.current = null;
  };

  return (
    <>
      {/* 오버레이 */}
      <div
        className={`fixed inset-0 bg-black z-40 ${open ? "pointer-events-auto" : "pointer-events-none"}`}
        style={{
          opacity: overlayOpacity,
          transition: dragX > 0 ? "none" : "opacity 0.2s"
        }}
        onClick={onClose}
      />
      {/* 드로어 */}
      <aside
        className={`fixed top-0 right-0 h-full w-[80vw] max-w-xs bg-white z-50 shadow-lg ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          transform: open
            ? `translateX(${dragX > 0 ? dragX : 0}px)`
            : "translateX(100%)",
          transition: dragX > 0 ? "none" : "all 200ms ease-in-out",
        }}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        <div className="flex flex-row h-full">
          {/* 왼쪽 회색 영역 */}
          <div className="bg-[#ededed] w-[20vw] max-w-[80px] min-w-[40px] h-full" />
          {/* 마이페이지 내용 */}
          <div className="flex flex-col items-center mt-12 flex-1">
            <div className="flex justify-center items-center mb-2 border border-gray-100 rounded-full w-26 h-26">
              <img
                src="/ceni-face.webp"
                alt="profile"
                className="w-20 h-20"
              />
            </div>
            <div className="text-sm">세니</div>
            <div className="text-sm text-gray-500 mb-20">ceni@itcen.com</div>
            <div className="w-full px-8 space-y-4">
              <div className="text-sm font-medium">내 QR</div>
              <div className="text-sm font-medium">나의 탑승내역</div>
              <div onClick={() => { onClose(); navigate('/inquiry'); }} className="text-sm font-medium">나의 문의내역</div>
            </div>
            <div className="w-[80%] border-t border-gray-200 mt-10 mb-6" />
            <div className="w-full px-8 space-y-2 text-sm text-gray-500">
              <div>개인정보 수정</div>
              <div className="cursor-pointer hover:text-blue-500">1:1 문의</div>
              <div className="mt-10">로그아웃</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default MyPageDrawer; 