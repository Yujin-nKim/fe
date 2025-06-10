import { useParams } from 'react-router-dom';
import BottomBar from '../components/BottomBar';
import TopBar from '../components/TopBar';
import notices from '../mocks/noticesMock';

export default function NoticeDetailPage() {
  const { id } = useParams();

  const notice = notices.find(n => n.id === Number(id));

  if (!notice) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-[#fdfdfe] pb-16 flex flex-col">
        <TopBar title="공지사항" />
        <div className="flex-1 flex items-center justify-center text-gray-400">존재하지 않는 공지입니다.</div>
        <BottomBar />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#fdfdfe] pb-16">
      <TopBar title="공지사항" />
      <div className="px-5 pt-20 pb-2">
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
      <BottomBar />
    </div>
  );
}
