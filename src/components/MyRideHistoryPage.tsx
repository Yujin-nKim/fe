import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomBar from './BottomBar';
import rideHistoryMock from './rideHistoryMock';
import Chatbot from './Chatbot';

const formatDate = (dateStr: string) => {
  const dateObj = new Date(dateStr);
  if (isNaN(dateObj.getTime())) return dateStr;
  return `${dateObj.getFullYear()}.${(dateObj.getMonth()+1).toString().padStart(2,'0')}.${dateObj.getDate().toString().padStart(2,'0')} ${dateObj.getHours().toString().padStart(2,'0')}:${dateObj.getMinutes().toString().padStart(2,'0')}`;
};

const MyRideHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [showChatbot, setShowChatbot] = useState(false);

  const handleChatbotToggle = () => {
    setShowChatbot(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-white pb-16">
      {/* 상단바 */}
      <div className="fixed left-0 top-0 right-0 z-20 flex items-center h-14 px-4 border-b border-gray-100 bg-[#5382E0]">
        <button className="absolute left-4" onClick={() => navigate(-1)}>
          <img src="/back.png" alt="뒤로가기" className="w-6 h-6 invert brightness-0" />
        </button>
        <div className="flex-1 text-center font-semibold text-lg text-white">나의 탑승 내역</div>
      </div>
      {/* 탑승 내역 리스트 */}
      <div className="pt-14 flex-1 px-4">
        {rideHistoryMock.map((ride) => (
          <div
            key={ride.id}
            className="py-3 border-b border-gray-100 relative"
          >
            <div className="font-bold text-sm mb-1">{ride.from} <span className="text-gray-400">→</span> {ride.to}</div>
            <div className="text-xs text-gray-400">{formatDate(ride.time)}</div>
          </div>
        ))}
      </div>
      {/* 하단바 */}
      <BottomBar />

      {/* 오른쪽 아래 챗봇 버튼 */}
      <button
        onClick={handleChatbotToggle}
        className="fixed bottom-20 right-4 z-30"
        aria-label={showChatbot ? '챗봇 닫기' : '챗봇 열기'}
      >
        <img src="/chat-bubble.png" alt="챗봇" className="w-16 h-16" />
      </button>
      {showChatbot && <Chatbot onClose={() => setShowChatbot(false)} />}
    </div>
  );
};

export default MyRideHistoryPage; 