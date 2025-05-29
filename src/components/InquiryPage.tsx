import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import BottomBar from './BottomBar';
import Chatbot from './Chatbot';

const inquiries = [
  {
    id: 1,
    title: '[셔틀버스] 시간 변경 문의',
    date: '2025.05.15',
    status: '답변완료',
  },
  {
    id: 2,
    title: '[건의] 순환셔틀 추가 운행 건의',
    date: '2025.05.01',
    status: '답변대기',
  },
  {
    id: 3,
    title: '[오류] QR코드 스캔 오류',
    date: '2025.04.20',
    status: '답변완료',
  },
];

function getStatusBadge(status: string) {
  if (status === '답변완료') {
    return <span className="text-xs text-white bg-[#5382E0] rounded px-2 py-0.5 font-semibold">답변완료</span>;
  }
  if (status === '답변대기') {
    return <span className="text-xs text-white bg-[#DEE9FF] rounded px-2 py-0.5 font-semibold">답변대기</span>;
  }
  return null;
}

export default function InquiryPage() {
  const navigate = useNavigate();
  const [showChatbot, setShowChatbot] = useState(false);
  const handleChatbotToggle = () => setShowChatbot(prev => !prev);

  return (
    <div className="flex flex-col min-h-screen pb-16">
      {/* 상단바 */}
      <div className="flex items-center h-14 px-4 relative bg-white">
        <button className="absolute left-4" onClick={() => navigate(-1)}>
          <img src="/back.png" alt="뒤로가기" className="w-6 h-6" />
        </button>
        <div className="flex-1 text-center font-semibold text-lg">1:1 문의</div>
      </div>
      <div className="border-b border-gray-100" />
      {/* 문의 목록 */}
      <div className="flex-1 px-4">
        {inquiries.map(inquiry => (
          <div key={inquiry.id} className="py-3 border-b border-gray-100">
            <div className="font-bold text-sm mb-1">{inquiry.title}</div>
            <div className="text-xs text-gray-400 mb-1">{inquiry.date}</div>
            {getStatusBadge(inquiry.status) && (
              <div className="mt-0.5">{getStatusBadge(inquiry.status)}</div>
            )}
          </div>
        ))}
      </div>
      {/* 문의하기 버튼 */}
      <div className="px-4 mt-6">
        <button
          className="w-full py-3 rounded-lg bg-[#5382E0] text-white text-base font-semibold shadow hover:bg-blue-700 transition"
          onClick={() => {/* 문의 작성 페이지로 이동 예정 */}}
        >
          문의하기
        </button>
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