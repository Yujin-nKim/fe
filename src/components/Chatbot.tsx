import React, { useRef, useState } from "react";

const DEFAULT_POSITION = {
  x: window.innerWidth - 340 - 16,
  y: window.innerHeight - 550 - 40,
};

export default function Chatbot({ onClose }: { onClose: () => void }) {
  const [position, setPosition] = useState(DEFAULT_POSITION);
  const [isResetting, setIsResetting] = useState(false);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const lastTouchPos = useRef(DEFAULT_POSITION);

  // 터치 드래그 (헤더에서만 시작)
  const onTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragging.current = true;
    setIsResetting(false); // 드래그 시작 시 애니메이션 제거
    const touch = e.touches[0];
    offset.current = {
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    };
    lastTouchPos.current = position;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragging.current) return;
    e.preventDefault();
    const touch = e.touches[0];
    const newPos = {
      x: touch.clientX - offset.current.x,
      y: touch.clientY - offset.current.y,
    };
    setPosition(newPos);
    lastTouchPos.current = newPos;
  };
  const onTouchEnd = () => {
    dragging.current = false;
    // 화면 밖이면 기본 위치로 복귀 (애니메이션 적용)
    const width = window.innerWidth;
    const height = window.innerHeight;
    const boxWidth = 340;
    const boxHeight = 400;
    const pos = lastTouchPos.current;
    if (
      pos.x < 0 ||
      pos.y < 0 ||
      pos.x + boxWidth > width ||
      pos.y + boxHeight > height
    ) {
      setIsResetting(true);
      setPosition(DEFAULT_POSITION);
    }
  };

  // 애니메이션 끝나면 transition 제거
  const handleTransitionEnd = () => {
    if (isResetting) setIsResetting(false);
  };

  return (
    <div
      className={`w-[340px] max-w-[95vw] bg-white rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden border border-gray-100${isResetting ? ' transition-all duration-300' : ''}`}
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
      }}
      onTransitionEnd={handleTransitionEnd}
    >
      {/* 상단 바 (드래그 핸들) */}
      <div
        className="flex items-center justify-center relative bg-[#5382E0] px-4 py-3 cursor-move select-none touch-none overscroll-contain"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <span className="text-white text-xl font-bold">CENI</span>
        <button
          onClick={onClose}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl font-bold focus:outline-none"
          aria-label="챗봇 닫기"
        >
          ×
        </button>
      </div>
      {/* 채팅 영역 */}
      <div className="flex-1 px-4 py-3 bg-[#f7faff] overflow-y-auto" style={{ minHeight: 320 }}>
        {/* 인트로 메시지: 봇 */}
        <div className="flex mb-2">
          <img src="/ceni-face.webp" alt="CENI" className="h-7 mr-2 object-cover" />
          <div>
            <div className="bg-[#e6edfa] text-gray-900 rounded-xl rounded-tl-none px-4 py-2 text-sm max-w-[220px]">
              아이티센의 마스코트, 세니입니다! 무엇을 도와드릴까요?
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <button className="bg-white border border-blue-200 text-blue-700 rounded-lg px-3 py-3 text-sm hover:bg-blue-50 transition cursor-default">가장 빠른 셔틀 출발 시간</button>
              <button className="bg-white border border-blue-200 text-blue-700 rounded-lg px-3 py-3 text-sm hover:bg-blue-50 transition cursor-default">셔틀 정류장 위치</button>
              <button className="bg-white border border-blue-200 text-blue-700 rounded-lg px-3 py-3 text-sm hover:bg-blue-50 transition cursor-default">셔틀 배차 간격</button>
            </div>
          </div>
        </div>
      </div>
      {/* 입력창 */}
      <div className="flex items-center px-3 py-2 border-t bg-white">
        <input
          className="flex-1 min-w-0 px-3 py-2 mr-4 rounded-lg border border-gray-200 text-sm focus:outline-none"
          placeholder="세니에게 질문해 보세요!"
        />
        <img src="/submit.png" alt="전송" className="w-6 h-6" />
      </div>
    </div>
  );
}
