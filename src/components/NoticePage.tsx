import { useNavigate } from 'react-router-dom';
import BottomBar from './BottomBar';

const notices = [
  {
    id: 1,
    title: '[필독] 셔틀버스 이용 안내',
    date: '2025.05.15 08:48',
    content: '셔틀버스 이용 시 QR코드 스캔은 필수입니다. 출퇴근 시간에 맞춰 이용해 주세요. QR코드 미지참 시 탑승이 제한될 수 있으니, 반드시 사전에 준비해 주시기 바랍니다. 또한, 탑승 시 마스크 착용을 권장합니다.'
  },
  {
    id: 2,
    title: '[공지] 5월 연휴 셔틀 미운행 안내',
    date: '2025.05.01 09:40',
    content: '5월 5일 어린이날은 법정 공휴일로 셔틀버스가 운행되지 않습니다. 연휴 기간 동안 셔틀 이용에 착오 없으시길 바라며, 자세한 일정은 추후 별도 안내드릴 예정입니다.'
  },
  {
    id: 3,
    title: '[안내] 앱 업데이트 안내',
    date: '2025.04.20 09:30',
    content: '슬기로운 아이티센 생활 앱이 업데이트 되었습니다. 최신 버전으로 업데이트 해 주세요. 이번 업데이트에서는 사용자 인터페이스 개선과 버그 수정, 그리고 새로운 기능이 추가되었습니다. 자세한 내용은 공지사항을 참고해 주세요.'
  },
];

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
      <div className="flex-1 px-4 pt-2">
        {notices.map(notice => (
          <div key={notice.id} className="py-3 border-b border-gray-100">
            <div className="font-bold text-sm mb-1">{notice.title}</div>
            <div className="text-xs text-gray-400 mb-1">{notice.date}</div>
            <div className="text-xs text-gray-600 truncate">{notice.content}</div>
          </div>
        ))}
      </div>
      {/* 하단바 */}
      <BottomBar />
    </div>
  );
}
