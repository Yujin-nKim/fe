import { useNavigate } from 'react-router-dom';

export default function Main() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-[calc(var(--vh,1vh)*100)] bg-white px-4 pt-6 pb-2 relative">
      {/* 상단 우측 햄버거 버튼 */}
      <div className="flex justify-end items-center w-full mb-2">
        <button className="p-2">
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
          src="/ceni-dance.gif"
          alt="ceni 캐릭터"
          className="w-36 h-36 object-contain drop-shadow-md"
          draggable={false}
        />
      </div>
      {/* 주요 기능 카드 */}
      <div className="grid grid-cols-2 gap-3 mt-8 mb-2">
        <button className="col-span-1 bg-[#5382E0] rounded-xl p-4 flex flex-col items-start shadow-sm min-h-[90px]" onClick={() => navigate('/qr')}> 
          <span className="font-bold text-base text-white mb-1">QR 코드</span>
          <span className="text-xs text-blue-100 mb-2">QR로 빠르게 셔틀에 탑승하세요.</span>
          <span className="ml-auto mt-auto"><img src="/qr.png" alt="QR 코드" className="w-7 h-7" /></span>
        </button>
        <button className="col-span-1 bg-[#DEE9FF] rounded-xl p-4 flex flex-col items-start shadow-sm min-h-[90px] relative" onClick={() => navigate('/notice')}>
          <span className="font-bold text-base text-blue-900 mb-1">공지</span>
          <span className="text-xs text-blue-700 mb-2">바로 셔틀 공지를 확인하세요.</span>
          <span className="ml-auto mt-auto"><img src="/announcement.png" alt="공지" className="w-7 h-7" /></span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <button className="col-span-1 bg-[#DEE9FF] rounded-xl p-4 flex flex-col items-start shadow-sm min-h-[90px]" onClick={() => navigate('/timetable')}>
          <span className="font-bold text-base text-blue-900 mb-1">시간표</span>
          <span className="text-xs text-blue-700 mb-2">셔틀 시간표를 확인하세요.</span>
          <span className="ml-auto mt-auto"><img src="/schedule.png" alt="시간표" className="w-7 h-7" /></span>
        </button>
        <button className="col-span-1 bg-[#DEE9FF] rounded-xl p-4 flex flex-col items-start shadow-sm min-h-[90px]" onClick={() => navigate('/inquiry')}>
          <span className="font-bold text-base text-blue-900 mb-1">1:1 문의</span>
          <span className="text-xs text-blue-700 mb-2">셔틀에서 궁금한 점이 있으신가요?</span>
          <span className="ml-auto mt-auto"><img src="/lost-items.png" alt="1:1 문의" className="w-7 h-7" /></span>
        </button>
      </div>
      {/* 오른쪽 아래 챗봇 버튼 */}
      <img src="/chat-bubble.png" alt="챗봇" className="w-16 h-16 fixed bottom-25 right-4 z-30" />
      {/* 하단바 */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 flex justify-around items-center h-16 z-20">
        <button className="flex flex-col items-center justify-center" onClick={() => navigate('/realtime')}>
          <img src="/bottom-bar/bus.png" alt="셔틀" className="w-7 h-7 mb-1" />
        </button>
        <button className="flex flex-col items-center justify-center" onClick={() => navigate('/')}> 
          <img src="/bottom-bar/home.png" alt="홈" className="w-7 h-7 mb-1" />
        </button>
        <button className="flex flex-col items-center justify-center" onClick={() => navigate('/notice')}> 
          <img src="/bottom-bar/clip-board.png" alt="공지" className="w-7 h-7 mb-1" />
        </button>
      </nav>
    </div>
  );
} 