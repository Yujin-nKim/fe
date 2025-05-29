import { useParams, useNavigate } from 'react-router-dom';
import BottomBar from './BottomBar';
import notices from './noticesMock';

export default function NoticeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
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
        <div className="text-xs text-gray-400 mb-2">{notice.date}</div>
      </div>
      <div className="mx-5 mb-4 bg-[#DEE9FF] border border-[#5382E0] rounded-xl p-4 text-gray-800 text-[15px] whitespace-pre-line">
        {notice.content}
      </div>
      <BottomBar />
    </div>
  );
}
