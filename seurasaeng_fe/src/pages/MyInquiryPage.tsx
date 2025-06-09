import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import BottomBar from '../components/BottomBar';
import inquiries from '../mocks/inquiriesMock';
import TopBar from '../components/TopBar';

function getStatusBadge(status: string) {
  if (status === '답변완료') {
    return <span className="text-xs text-white bg-[#5382E0] rounded px-2 py-0.5 font-semibold">답변완료</span>;
  }
  if (status === '답변대기') {
    return <span className="text-xs text-white bg-[#DEE9FF] rounded px-2 py-0.5 font-semibold">답변대기</span>;
  }
  return null;
}

export default function MyInquiryPage({ isAdmin = false }) {
  const navigate = useNavigate();
  const [draggedId, setDraggedId] = useState<number|null>(null);
  const [dragXMap, setDragXMap] = useState<{[id:number]:number}>({});
  const startXRef = useRef(0);
  const [startY, setStartY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  // 슬라이드 시작
  const handleTouchStart = (e: React.TouchEvent, id: number) => {
    startXRef.current = e.touches[0].clientX - (dragXMap[id] || 0);
    setStartY(e.touches[0].clientY);
    setDraggedId(id);
    setIsScrolling(false);
  };

  // 슬라이드 중
  const handleTouchMove = (e: React.TouchEvent, id: number) => {
    if (draggedId !== id) return;
    const deltaX = e.touches[0].clientX - startXRef.current;
    const deltaY = e.touches[0].clientY - startY;

    // 수직 스크롤이 더 큰 경우 스크롤 모드로 전환
    if (!isScrolling && Math.abs(deltaY) > Math.abs(deltaX)) {
      setIsScrolling(true);
      setDraggedId(null); // 스크롤 모드로 전환되면 draggedId를 null로 설정
      return;
    }

    // 스크롤 중이면 슬라이드 동작 무시
    if (isScrolling) return;

    setDragXMap(prev => ({ ...prev, [id]: Math.min(0, Math.max(deltaX, -80)) }));
  };

  // 슬라이드 끝
  const handleTouchEnd = (id: number) => {
    const dragX = dragXMap[id] || 0;
    if (dragX < -40) {
      setDragXMap(prev => ({ ...prev, [id]: -80 }));
    } else {
      setDragXMap(prev => ({ ...prev, [id]: 0 }));
    }
    setDraggedId(null);
    setIsScrolling(false);
  };

  return (
    <div className="min-h-screen pb-50 bg-white">
      {/* 상단바 */}
      <TopBar title={isAdmin ? "1:1 문의 관리" : "나의 문의 내역"} />
      <div className="border-b border-gray-100" />
      {/* 문의 목록 */}
      <div className="flex-1 pl-4 pt-14">
        {inquiries.map(inquiry => {
          const dragX = dragXMap[inquiry.id] || 0;
          const isDragging = draggedId === inquiry.id;
          return (
            <div key={inquiry.id} className="relative overflow-hidden">
              {/* 문의 카드 */}
              <div
                className="py-3 border-b border-gray-100 bg-white pr-20"
                style={{
                  transform: `translateX(${dragX}px)`,
                  transition: isDragging ? 'none' : 'transform 0.2s',
                }}
                onTouchStart={e => handleTouchStart(e, inquiry.id)}
                onTouchMove={e => handleTouchMove(e, inquiry.id)}
                onTouchEnd={() => handleTouchEnd(inquiry.id)}
                onClick={() => navigate(isAdmin ? `/admin/inquiry/${inquiry.id}` : `/inquiry/${inquiry.id}`)}
              >
                <div className="font-bold text-sm mb-1">{inquiry.title}</div>
                <div className="text-xs text-gray-400 mb-1">
                  {(() => {
                    const dateObj = new Date(inquiry.date);
                    if (isNaN(dateObj.getTime())) return inquiry.date;
                    return `${dateObj.getFullYear()}.${(dateObj.getMonth()+1).toString().padStart(2,'0')}.${dateObj.getDate().toString().padStart(2,'0')} ${dateObj.getHours().toString().padStart(2,'0')}:${dateObj.getMinutes().toString().padStart(2,'0')}`;
                  })()}
                </div>
                {getStatusBadge(inquiry.status) && (
                  <div className="mt-0.5">{getStatusBadge(inquiry.status)}</div>
                )}
              </div>
              {/* 삭제 버튼 */}
              <button
                className="absolute top-0 h-full w-20 bg-red-500 text-white font-bold text-base z-10 duration-300"
                style={{
                  left: `calc(100% + ${dragX}px)`,
                  transition: isDragging ? 'none' : 'left 0.2s',
                  pointerEvents: Math.abs(dragX) > 40 ? 'auto' : 'none',
                }}
                onClick={() => {/* 삭제 기능 구현 필요시 여기에 */}}
              >
                삭제
              </button>
            </div>
          );
        })}
      </div>
      {/* 문의하기 FAB 버튼 - 하단 중앙 */}
      {!isAdmin && (
        <button
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 w-16 h-16 rounded-full bg-[#5382E0] text-white flex items-center justify-center shadow-lg text-xl font-bold"
          style={{ boxShadow: '0 4px 16px rgba(83,130,224,0.15)' }}
          onClick={() => navigate('/inquiry/write')}
          aria-label="문의하기"
        >
          <img src="/add.png" alt="문의하기" className="w-8 h-8 brightness-0 invert" />
        </button>
      )}
      <BottomBar />
    </div>
  );
}
