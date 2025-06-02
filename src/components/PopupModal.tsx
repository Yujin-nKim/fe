import React, { useRef, useEffect } from 'react';

interface PopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  dontShowTodayHandler: () => void;
  goToNoticeHandler: () => void;
}

const DRAG_CLOSE_THRESHOLD = 100; // px

const PopupModal: React.FC<PopupModalProps> = ({ isOpen, onClose, title, content, dontShowTodayHandler, goToNoticeHandler }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef<number | null>(null);
  const currentYRef = useRef<number>(0);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.style.transform = isOpen ? 'translateY(0)' : 'translateY(100%)';
    }
  }, [isOpen]);

  // 바깥 배경 클릭 시 닫힘 처리
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 드래그 시작
  const handleDragStart = (e: React.TouchEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    if (modalRef.current) {
      modalRef.current.style.transition = 'none';
    }
    startYRef.current = e.touches[0].clientY;
    currentYRef.current = e.touches[0].clientY;
  };

  // 드래그 중
  const handleDragMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || startYRef.current === null || !modalRef.current) return;
    
    currentYRef.current = e.touches[0].clientY;
    const deltaY = currentYRef.current - startYRef.current;
    if (deltaY > 0) {
      modalRef.current.style.transform = `translateY(${deltaY}px)`;
    }
  };

  // 드래그 끝
  const handleDragEnd = () => {
    if (!modalRef.current) return;
    
    isDraggingRef.current = false;
    modalRef.current.style.transition = 'transform 300ms ease-in-out';
    
    const deltaY = currentYRef.current - startYRef.current!;
    if (deltaY > DRAG_CLOSE_THRESHOLD) {
      onClose();
    } else {
      modalRef.current.style.transform = 'translateY(0)';
    }
    startYRef.current = null;
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center items-end transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} bg-black/20`}
      onClick={handleBackgroundClick}
    >
      <div
        ref={modalRef}
        className={`w-full max-w-md bg-white rounded-t-2xl p-6 shadow-lg relative flex flex-col`}
        style={{
          minHeight: '400px',
          transform: 'translateY(100%)',
          touchAction: 'none',
          transition: 'transform 300ms ease-in-out',
        }}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white text-[#5382E0] hover:bg-blue-50 hover:text-blue-700 transition"
          aria-label="닫기"
        >
          <svg className="w-6 h-6" fill="none" stroke="#5382E0" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex-1 flex flex-col justify-start">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center mt-10">{title}</h2>
          <div className="text-gray-600 mb-6 text-center whitespace-pre-line line-clamp-4">{content}</div>
        </div>
        {/* 공지 바로가기 링크 */}
        {goToNoticeHandler && (
          <div className="w-full text-center mb-4">
            <button
              onClick={goToNoticeHandler}
              className="text-[#5382E0] text-sm underline hover:font-bold transition p-0 bg-transparent"
              style={{ background: 'none' }}
            >
              공지 바로가기
            </button>
          </div>
        )}
        {/* 버튼 영역: 오늘 그만 보기 + 확인 */}
        {dontShowTodayHandler ? (
          <div className="flex gap-2 mt-2">
            <button
              onClick={dontShowTodayHandler}
              className="flex-1 bg-white border border-[#5382E0] text-[#5382E0] py-3 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors"
            >
              오늘 그만 보기
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-[#5382E0] text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-600 transition-colors"
            >
              확인
            </button>
          </div>
        ) : (
          <button
            onClick={onClose}
            className="w-full bg-[#5382E0] text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-600 transition-colors mt-6"
          >
            확인
          </button>
        )}
      </div>
    </div>
  );
};

export default PopupModal; 