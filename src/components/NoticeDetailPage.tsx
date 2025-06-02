import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import BottomBar from './BottomBar';
import notices from './noticesMock';
import Chatbot from './Chatbot';

export default function NoticeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showChatbot, setShowChatbot] = useState(false);

  const handleChatbotToggle = () => {
    setShowChatbot(prev => !prev);
  };

  const notice = notices.find(n => n.id === Number(id));

  if (!notice) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-[#fdfdfe] pb-16 flex flex-col">
        <div className="flex items-center h-14 px-4 bg-[#5382E0] border-b border-[#5382E0]">
          <button className="absolute left-4" onClick={() => navigate(-1)}>
            <img src="/back.png" alt="뒤로가기" className="w-6 h-6 invert brightness-0" />
          </button>
          <span className="flex-1 text-center text-white font-bold text-lg">공지사항</span>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-400">존재하지 않는 공지입니다.</div>
        <BottomBar />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#fdfdfe] pb-16">
      <div className="flex items-center h-14 px-4 bg-[#5382E0] border-b border-[#5382E0] relative">
        <button className="absolute left-4" onClick={() => navigate(-1)}>
          <img src="/back.png" alt="뒤로가기" className="w-6 h-6 invert brightness-0" />
        </button>
        <span className="flex-1 text-center text-white font-bold text-lg">공지사항</span>
      </div>
      <div className="px-5 pt-6 pb-2">
        <div className="text-[#5382E0] font-bold text-base mb-1">{notice.title}</div>
        <div className="text-xs text-gray-400 mb-2">
          {(() => {
            const dateObj = new Date(notice.date);
            if (isNaN(dateObj.getTime())) return notice.date;
            return `${dateObj.getFullYear()}.${(dateObj.getMonth()+1).toString().padStart(2,'0')}.${dateObj.getDate().toString().padStart(2,'0')} ${dateObj.getHours().toString().padStart(2,'0')}:${dateObj.getMinutes().toString().padStart(2,'0')}`;
          })()}
        </div>
      </div>
      <div className="mx-5 mb-4 bg-[#DEE9FF] border border-[#5382E0] rounded-xl p-4 text-gray-800 text-[15px] whitespace-pre-line">
        {notice.content}
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
      <BottomBar />
    </div>
  );
}
