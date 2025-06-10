import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Chatbot from '../components/Chatbot';
import MyPageDrawer from '../components/MyPageDrawer';
import BottomBar from '../components/BottomBar';
import PopupModal from '../components/PopupModal';
import notices from '../mocks/noticesMock';

// 드로어 관련 상수
const DRAWER_WIDTH = 80; // 드로어의 너비 (vw 단위)

export default function MainPage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(() => {
    const today = new Date().toISOString().slice(0, 10);
    return localStorage.getItem('hidePopupToday') !== today;
  });
  const [showChatbot, setShowChatbot] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dragX, setDragX] = useState(0);

  // 최신 공지 가져오기 (date 기준 내림차순 정렬 후 첫 번째)
  const latestNotice = [...notices].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  // 오늘 그만 보기 버튼 핸들러
  const handleDontShowToday = () => {
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem('hidePopupToday', today);
    setShowModal(false);
  };

  // 공지 바로가기 핸들러
  const handleGoToNotice = () => {
    if (latestNotice?.id) {
      navigate(`/notice/${latestNotice.id}`);
      setShowModal(false);
    }
  };

  // 페이지 진입 시 모달 상태 초기화
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const shouldShowModal = localStorage.getItem('hidePopupToday') !== today;
    
    // 모달 상태를 잠시 false로 설정했다가 true로 변경하여 애니메이션 트리거
    if (shouldShowModal) {
      setShowModal(false);
      requestAnimationFrame(() => {
        setShowModal(true);
      });
    }
  }, []);

  const handleChatbotToggle = () => {
    setShowChatbot(prev => !prev);
  };

  const handleDrawerDrag = (x: number) => {
    setDragX(x);
  };

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
    setShowChatbot(false); // 마이페이지가 열릴 때 챗봇 닫기
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setDragX(0);
  };

  useEffect(() => {
    if (drawerOpen) {
      window.history.pushState({ drawer: true }, '');
    }
  }, [drawerOpen]);

  useEffect(() => {
    const handlePopState = () => {
      if (drawerOpen) {
        handleDrawerClose();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [drawerOpen]);

  // 드래그 중일 때와 아닐 때의 transform 계산
  const getTransform = () => {
    if (!drawerOpen) return 'translateX(0)';
    // 드래그 거리를 화면 너비의 비율로 변환
    const dragRatio = (dragX / window.innerWidth) * 100;
    const translateX = -DRAWER_WIDTH + dragRatio;
    return `translateX(${translateX}vw)`;
  };

  return (
    <div className="flex flex-col h-[calc(var(--vh,1vh)*100)] bg-[#fdfdfe] px-4 pt-6 pb-2 relative">
      {/* 팝업 모달 */}
      <PopupModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={latestNotice?.title || '공지사항'}
        content={latestNotice?.content || '공지 내용이 없습니다.'}
        dontShowTodayHandler={handleDontShowToday}
        goToNoticeHandler={handleGoToNotice}
      />
      {/* 메인 컨텐츠를 감싸는 div에 transition 추가 */}
      <div 
        style={{
          transform: getTransform(),
          transition: dragX > 0 ? 'none' : 'all 200ms ease-in-out',
        }}
      >
        {/* 상단 우측 햄버거 버튼 */}
        <div className="flex justify-end items-center w-full mb-2">
          <button className="p-2" onClick={handleDrawerOpen}>
            {/* 햄버거 아이콘 */}
            <span className="ml-auto mt-auto"><img src="/hamburger.png" alt="마이페이지 메뉴" className="w-7 h-7" /></span>
          </button>
        </div>
        {/* 안내문구 + 캐릭터 이미지 (한 줄 배치) */}
        <div className="flex flex-row items-start justify-between mb-2 mt-2 w-full">
          <div className="flex flex-col mr-2 mt-2 flex-1 min-w-0">
            <p className="text-[15px] text-blue-500 font-medium leading-tight text-left break-words">
              ITCEN 셔틀의<br />모든 것을 한눈에!
            </p>
            <div className="w-28 h-1 bg-blue-100 rounded-full mt-2 mb-2" />
          </div>
          <img
            src="/ceni-dance2.gif"
            alt="ceni 캐릭터"
            className="w-36 h-36"
            draggable={false}
          />
        </div>
        {/* 주요 기능 카드 */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button className="col-span-1 bg-[#5382E0] rounded-xl p-4 flex flex-col items-start shadow-sm min-h-[90px]" onClick={() => navigate('/qr')}> 
            <span className="font-bold text-base text-white mb-1">QR 코드</span>
            <span className="text-xs text-white mb-2 w-36 text-left">QR로 빠르게 셔틀에 탑승하세요.</span>
            <span className="ml-auto mt-auto"><img src="/qr.png" alt="QR 코드" className="w-7 h-7" /></span>
          </button>
          <button className="col-span-1 bg-[#DEE9FF] rounded-xl p-4 flex flex-col items-start shadow-sm min-h-[90px] relative" onClick={() => navigate('/notice')}>
            <span className="font-bold text-base text-[#5382E0]">공지</span>
            <span className="text-xs mb-2 text-[#5382E0] w-36 text-left">바로 셔틀 공지를 확인하세요.</span>
            <span className="ml-auto mt-auto"><img src="/announcement.png" alt="공지" className="w-7 h-7" /></span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <button className="col-span-1 bg-[#DEE9FF] rounded-xl p-4 flex flex-col items-start shadow-sm min-h-[90px]" onClick={() => navigate('/timetable')}>
            <span className="font-bold text-base text-[#5382E0]">시간표</span>
            <span className="text-xs mb-2 text-[#5382E0] w-36 text-left">셔틀 시간표를 확인하세요.</span>
            <span className="ml-auto mt-auto"><img src="/schedule.png" alt="시간표" className="w-7 h-7" /></span>
          </button>
          <button className="col-span-1 bg-[#DEE9FF] rounded-xl p-4 flex flex-col items-start shadow-sm min-h-[90px]" onClick={() => navigate('/inquiry/write')}>
            <span className="font-bold text-base text-[#5382E0]">1:1 문의</span>
            <span className="text-xs mb-2 text-[#5382E0] w-36 text-left">셔틀에서 무엇을 잃어버리셨나요?</span>
            <span className="ml-auto mt-auto"><img src="/lost-items.png" alt="1:1 문의" className="w-7 h-7" /></span>
          </button>
          <button className="col-span-1 bg-[#DEE9FF] rounded-xl p-4 flex flex-col items-start shadow-sm min-h-[90px]" onClick={() => navigate('/realtime-shuttle')}>
            <span className="font-bold text-base text-[#5382E0]">실시간 셔틀 확인</span>
            <span className="text-xs mb-2 text-[#5382E0] w-36 text-left">실시간으로 셔틀 위치를 확인하세요.</span>
            <span className="ml-auto mt-auto"><img src="/shuttle.png" alt="실시간 셔틀" className="w-7 h-7" /></span>
          </button>
          <button className="col-span-1 bg-[#DEE9FF] rounded-xl p-4 flex flex-col items-start shadow-sm min-h-[90px]" onClick={() => navigate('/admin')}>
            <span className="font-bold text-base text-[#5382E0]">관리자 페이지</span>
            <span className="text-xs mb-2 text-[#5382E0] w-36 text-left">관리자 기능을 테스트하세요.</span>
            <span className="ml-auto mt-auto"><img src="/admin.png" alt="관리자" className="w-7 h-7" /></span>
          </button>
        </div>
      </div>
      {/* 오른쪽 아래 챗봇 버튼 */}
      <button
        onClick={handleChatbotToggle}
        className="fixed bottom-20 right-4 z-30"
        aria-label={showChatbot ? '챗봇 닫기' : '챗봇 열기'}
      >
        <img src="/chat-bubble.png" alt="챗봇" className="w-16 h-16" />
      </button>
      {showChatbot && <Chatbot onClose={() => setShowChatbot(false)} />}
      {/* 마이페이지 드로어 */}
      <MyPageDrawer 
        open={drawerOpen} 
        onClose={handleDrawerClose}
        onDrag={handleDrawerDrag}
      />
      {/* 하단바 */}
      <BottomBar 
        transform={getTransform()}
        transition={dragX > 0 ? 'none' : 'all 200ms ease-in-out'}
      />
    </div>
  );
} 