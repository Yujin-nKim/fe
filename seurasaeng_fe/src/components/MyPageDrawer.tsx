import React, { useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import type { MyPageDrawerProps } from '../types/ComponentTypes';

const DRAG_CLOSE_THRESHOLD = 80; // px
const MAX_OVERLAY_OPACITY = 0.18;

const MyPageDrawer: React.FC<MyPageDrawerProps> = ({ open, onClose, onDrag }) => {
  const startXRef = useRef<number | null>(null);
  const currentXRef = useRef<number>(0);
  const drawerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (drawerRef.current && overlayRef.current) {
      if (open) {
        drawerRef.current.style.transform = 'translateX(0)';
        overlayRef.current.style.opacity = String(MAX_OVERLAY_OPACITY);
      } else {
        drawerRef.current.style.transform = 'translateX(100%)';
        overlayRef.current.style.opacity = '0';
      }
    }
  }, [open]);

  // 터치 시작
  const handleDragStart = (e: React.TouchEvent) => {
    isDraggingRef.current = true;
    if (drawerRef.current) {
      drawerRef.current.style.transition = 'none';
    }
    if (overlayRef.current) {
      overlayRef.current.style.transition = 'none';
    }
    startXRef.current = e.touches[0].clientX;
    currentXRef.current = e.touches[0].clientX;
  };

  // 터치 이동
  const handleDragMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || startXRef.current === null || !drawerRef.current || !overlayRef.current) return;
    
    currentXRef.current = e.touches[0].clientX;
    const deltaX = currentXRef.current - startXRef.current;
    
    if (deltaX > 0) {
      drawerRef.current.style.transform = `translateX(${deltaX}px)`;
      const opacity = MAX_OVERLAY_OPACITY * (1 - deltaX / window.innerWidth);
      overlayRef.current.style.opacity = String(opacity);
      onDrag(deltaX);
    }
  };

  // 터치 끝
  const handleDragEnd = () => {
    if (!drawerRef.current || !overlayRef.current) return;
    
    isDraggingRef.current = false;
    drawerRef.current.style.transition = 'transform 200ms ease-in-out';
    overlayRef.current.style.transition = 'opacity 200ms ease-in-out';
    
    const deltaX = currentXRef.current - startXRef.current!;
    if (deltaX > DRAG_CLOSE_THRESHOLD) {
      onClose();
      // 히스토리에서 가짜 스택 제거
      if (window.history.state && window.history.state.drawer) {
        window.history.back();
      }
    } else {
      drawerRef.current.style.transform = 'translateX(0)';
      overlayRef.current.style.opacity = String(MAX_OVERLAY_OPACITY);
    }
    onDrag(0);
    startXRef.current = null;
  };

  return (
    <>
      {/* 오버레이 */}
      <div
        ref={overlayRef}
        className={`fixed inset-0 bg-black z-40 ${open ? "pointer-events-auto" : "pointer-events-none"}`}
        style={{
          opacity: 0,
          transition: 'opacity 200ms ease-in-out'
        }}
        onClick={onClose}
      />
      {/* 드로어 */}
      <aside
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-[80vw] max-w-xs bg-white z-50 shadow-lg`}
        style={{
          transform: 'translateX(100%)',
          transition: 'transform 200ms ease-in-out',
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
              <div onClick={() => { onClose(); navigate('/qr'); }} className="text-sm font-medium">내 QR</div>
              <div onClick={() => { onClose(); navigate('/my-ride-history'); }} className="text-sm font-medium">나의 탑승 내역</div>
              <div onClick={() => { onClose(); navigate('/inquiry'); }} className="text-sm font-medium">나의 문의 내역</div>
            </div>
            <div className="w-[80%] border-t border-gray-200 mt-10 mb-6" />
            <div className="w-full px-8 space-y-2 text-sm text-gray-500">
              <div onClick={() => { onClose(); navigate('/edit-profile'); }} className="cursor-pointer hover:text-blue-500">개인정보 수정</div>
              <div onClick={() => { onClose(); navigate('/inquiry/write'); }} className="cursor-pointer hover:text-blue-500">1:1 문의</div>
              <div className="mt-10">로그아웃</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default MyPageDrawer; 