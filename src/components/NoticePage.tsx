import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import BottomBar from './BottomBar';
import notices from '../mocks/noticesMock';
import Chatbot from './Chatbot';

export default function NoticePage() {
  const navigate = useNavigate();
  const [showChatbot, setShowChatbot] = useState(false);

  const handleChatbotToggle = () => {
    setShowChatbot(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-white pb-40">
      {/* 상단바 */}
      <div className="fixed left-0 top-0 right-0 z-20 flex items-center h-14 px-4 border-b border-gray-100 bg-[#5382E0]">
        <button className="absolute left-4" onClick={() => navigate(-1)}>
          <img src="/back.png" alt="뒤로가기" className="w-6 h-6 invert brightness-0" />
        </button>
        <div className="flex-1 text-center font-semibold text-lg text-white">공지사항</div>
      </div>
      {/* 공지 리스트 */}
      <div className="pt-14 flex-1 px-4">
        {notices.map(notice => (
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
        ))}
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
      {/* 하단바 */}
      <BottomBar />
    </div>
  );
}
