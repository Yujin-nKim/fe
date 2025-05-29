import { useNavigate } from 'react-router-dom';
import BottomBar from './BottomBar';
import notices from './noticesMock';

export default function NoticePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-white pb-16">
      {/* 상단바 */}
      <div className="flex items-center h-14 px-4 border-b border-gray-100 relative">
        <button className="absolute left-4" onClick={() => navigate(-1)}>
          <img src="/back.png" alt="뒤로가기" className="w-6 h-6" />
        </button>
        <div className="flex-1 text-center font-semibold text-lg">공지사항</div>
      </div>
      {/* 공지 리스트 */}
      <div className="flex-1 px-4">
        {notices.map(notice => (
          <div
            key={notice.id}
            className="py-3 border-b border-gray-100"
            onClick={() => navigate(`/notice/${notice.id}`)}
          >
            <div className="font-bold text-sm mb-1">{notice.title}</div>
            <div className="text-xs text-gray-400 mb-2">{notice.date}</div>
            <div className="text-xs text-gray-600 truncate select-none">{notice.content}</div>
          </div>
        ))}
      </div>
      {/* 하단바 */}
      <BottomBar />
    </div>
  );
}
