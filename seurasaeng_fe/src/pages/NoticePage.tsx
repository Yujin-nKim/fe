import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomBar from '../components/BottomBar';
import notices from '../mocks/noticesMock';
import TopBar from '../components/TopBar';

export default function NoticePage({ isAdmin = false }) {
  const navigate = useNavigate();
  const [draggedId, setDraggedId] = useState<number|null>(null);
  const [dragXMap, setDragXMap] = useState<{[id:number]:number}>({});
  const startXRef = useRef(0);
  const [startY, setStartY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  // 버튼 관련 상수 (중복 제거)
  const BUTTON_WIDTH = 80; // px, w-20
  const BUTTON_COUNT = 2;
  const BUTTONS_TOTAL_WIDTH = BUTTON_WIDTH * BUTTON_COUNT;

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
    if (!isScrolling && Math.abs(deltaY) > Math.abs(deltaX)) {
      setIsScrolling(true);
      setDraggedId(null);
      return;
    }
    if (isScrolling) return;
    setDragXMap(prev => ({ ...prev, [id]: Math.min(0, Math.max(deltaX, -BUTTONS_TOTAL_WIDTH)) }));
  };

  // 슬라이드 끝
  const handleTouchEnd = (id: number) => {
    const dragX = dragXMap[id] || 0;
    const THRESHOLD = -BUTTONS_TOTAL_WIDTH / 2;
    if (dragX < THRESHOLD) {
      setDragXMap(prev => ({ ...prev, [id]: -BUTTONS_TOTAL_WIDTH }));
    } else {
      setDragXMap(prev => ({ ...prev, [id]: 0 }));
    }
    setDraggedId(null);
    setIsScrolling(false);
  };

  // 삭제 핸들러 (실제 삭제 로직은 추후 구현)
  const handleDelete = () => {
    // TODO: 삭제 로직 구현
    alert('삭제 기능은 아직 구현되지 않았습니다.');
  };

  return (
    <div className="min-h-screen bg-white pb-40">
      {/* 상단바 */}
      <TopBar title={isAdmin ? "공지사항 관리" : "공지사항"} />
      {/* 공지 리스트 */}
      <div className="pt-14 flex-1 px-4">
        {notices.map(notice => {
          if (isAdmin) {
            const dragX = dragXMap[notice.id] || 0;
            const isDragging = draggedId === notice.id;
            return (
              <div key={notice.id} className="relative overflow-hidden">
                <div
                  className="py-3 border-b border-gray-100 bg-white relative"
                  style={{
                    transform: `translateX(${dragX}px)`,
                    transition: isDragging ? 'none' : 'transform 0.2s',
                  }}
                  onTouchStart={e => handleTouchStart(e, notice.id)}
                  onTouchMove={e => handleTouchMove(e, notice.id)}
                  onTouchEnd={() => handleTouchEnd(notice.id)}
                  onClick={() => navigate(`/notice/${notice.id}`)}
                >
                  <div className="font-bold text-sm mb-1">{notice.title}</div>
                  <div className="text-xs text-gray-400 mb-2">
                    {(() => {
                      const dateObj = new Date(notice.date);
                      if (isNaN(dateObj.getTime())) return notice.date;
                      return `${dateObj.getFullYear()}.${(dateObj.getMonth()+1).toString().padStart(2,'0')}.${dateObj.getDate().toString().padStart(2,'0')} ${dateObj.getHours().toString().padStart(2,'0')}:${dateObj.getMinutes().toString().padStart(2,'0')}`;
                    })()}
                  </div>
                  <div className="text-xs text-gray-600 truncate select-none">{notice.content}</div>
                </div>
                {/* 버튼 컨테이너 */}
                <div
                  className="absolute top-0 h-full flex z-5"
                  style={{
                    left: `calc(100% + ${dragX}px)`,
                    transition: isDragging ? 'none' : 'left 0.2s',
                    pointerEvents: Math.abs(dragX) > 40 ? 'auto' : 'none',
                  }}
                >
                  <button
                    className="w-20 h-full bg-blue-500 text-white font-bold text-base duration-300"
                    onClick={() => alert('팝업 설정 기능은 아직 구현되지 않았습니다.')}
                  >
                    팝업 설정
                  </button>
                  <button
                    className="w-20 h-full bg-red-500 text-white font-bold text-base duration-300"
                    onClick={handleDelete}
                  >
                    삭제
                  </button>
                </div>
              </div>
            );
          } else {
            return (
              <div
                key={notice.id}
                className="py-3 border-b border-gray-100 relative"
                onClick={() => navigate(`/notice/${notice.id}`)}
              >
                <div className="font-bold text-sm mb-1">{notice.title}</div>
                <div className="text-xs text-gray-400 mb-2">
                  {(() => {
                    const dateObj = new Date(notice.date);
                    if (isNaN(dateObj.getTime())) return notice.date;
                    return `${dateObj.getFullYear()}.${(dateObj.getMonth()+1).toString().padStart(2,'0')}.${dateObj.getDate().toString().padStart(2,'0')} ${dateObj.getHours().toString().padStart(2,'0')}:${dateObj.getMinutes().toString().padStart(2,'0')}`;
                  })()}
                </div>
                <div className="text-xs text-gray-600 truncate select-none">{notice.content}</div>
              </div>
            );
          }
        })}
      </div>
      {/* 하단바 */}
      {isAdmin && (
        <button
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 w-16 h-16 rounded-full bg-[#5382E0] text-white flex items-center justify-center shadow-lg text-xl font-bold"
          style={{ boxShadow: '0 4px 16px rgba(83,130,224,0.15)' }}
          onClick={() => navigate('/admin/notice/write')}
          aria-label="공지 추가"
        >
          <img src="/add.png" alt="공지 추가" className="w-8 h-8 brightness-0 invert" />
        </button>
      )}
      <BottomBar />
    </div>
  );
}
