import { useParams, useNavigate } from 'react-router-dom';
import BottomBar from './BottomBar';
import notices from './noticesMock';

export default function NoticeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const notice = notices.find(n => n.id === Number(id));

  if (!notice) {
    return (
      <div className="flex flex-col min-h-screen bg-white pb-16">
        <div className="flex items-center h-14 px-4 border-b border-gray-100 relative">
          <button className="absolute left-4" onClick={() => navigate(-1)}>
            <img src="/back.png" alt="뒤로가기" className="w-6 h-6" />
          </button>
          <div className="flex-1 text-center font-semibold text-lg">공지사항</div>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-400">존재하지 않는 공지입니다.</div>
        <BottomBar />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white pb-16">
      <div className="flex items-center h-14 px-4 border-b border-gray-100 relative">
        <button className="absolute left-4" onClick={() => navigate(-1)}>
          <img src="/back.png" alt="뒤로가기" className="w-6 h-6" />
        </button>
        <div className="flex-1 text-center font-semibold text-lg">공지사항</div>
      </div>
      <div className="flex-1 px-4 pt-6">
        <div className="font-bold text-lg mb-2">{notice.title}</div>
        <div className="text-xs text-gray-400 mb-4">{notice.date}</div>
        <div className="text-base text-gray-700 whitespace-pre-line">{notice.content}</div>
      </div>
      <BottomBar />
    </div>
  );
}
