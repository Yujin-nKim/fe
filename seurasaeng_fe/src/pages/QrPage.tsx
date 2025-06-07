import React, { useRef, useState, useEffect } from 'react';
import TopBar from '../components/TopBar';

const QrPage: React.FC = () => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const start = useRef({ x: 0, y: 0 });
  const startRotate = useRef({ x: 0, y: 0 });

  // 페이지 전체에서 풀 다운 새로고침 방지
  useEffect(() => {
    const prevent = (e: TouchEvent) => {
      if (e.touches.length === 1) e.preventDefault();
    };
    document.body.addEventListener('touchmove', prevent, { passive: false });
    return () => {
      document.body.removeEventListener('touchmove', prevent);
    };
  }, []);

  // 터치 이벤트 (상하좌우)
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    start.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    startRotate.current = { ...rotate };
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - start.current.x;
    const deltaY = e.touches[0].clientY - start.current.y;
    setRotate({
      x: startRotate.current.x - deltaY / 6,
      y: startRotate.current.y + deltaX / 6,
    });
  };
  const handleTouchEnd = () => {
    setIsDragging(false);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div className="min-h-[calc(var(--vh,1vh)*100)] bg-neutral-900 flex flex-col items-center justify-center">
      {/* 상단바 */}
      <TopBar title="QR 코드" bgColorClass="bg-neutral-900" />
      {/* 중앙 카드 */}
      <div className="w-full flex-1 flex flex-col items-center justify-center pt-6">
        <div className="relative flex items-center justify-center">
          {/* 카드 본체 */}
          <div
            className="rounded-2xl shadow-xl w-[300px] max-w-[90vw] flex flex-col items-center px-4 pt-4 pb-6 min-h-[500px] relative select-none z-10 bg-[#5382E0]"
            style={{
              transform: `perspective(900px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
              transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(.23,1.01,.32,1)'
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* 카드 상단 로고 - 왼쪽 정렬 */}
            <div className="w-full flex items-center mb-16">
              <img src="/itcen-logo.png" alt="itcen 로고" className="w-20 h-auto" />
            </div>
            {/* 이름 */}
            <div className="text-2xl font-bold text-white mb-2">세니</div>
            {/* QR+프로필 */}
            <div className="relative flex items-center justify-center mb-6 mt-2">
              <img 
                src="/real-qr.png" 
                alt="QR Code" 
                className="w-44 h-44 object-contain rounded-lg"
              />
              <img
                src="/ceni-face.webp"
                alt="Profile"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 object-contain"
              />
            </div>
            {/* flex-grow로 남는 공간 채우기 */}
            <div className="flex-grow" />
            {/* 설명 */}
            <div className="text-center text-xs text-blue-100 mb-2">이 QR코드는 탑승 인증용입니다.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrPage; 