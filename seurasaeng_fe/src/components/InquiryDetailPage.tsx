import { useParams, useNavigate } from "react-router-dom";
import inquiries from "../mocks/inquiriesMock";
import BottomBar from './BottomBar';
import TopBar from './TopBar';

const InquiryDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const inquiry = inquiries.find(q => q.id === Number(id));

  if (!inquiry) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-[#fdfdfe] pb-16 flex flex-col">
        <div className="flex items-center h-14 px-4 bg-[#5382E0] border-b border-[#5382E0]">
          <button className="absolute left-4" onClick={() => navigate(-1)}>
            <img src="/back.png" alt="뒤로가기" className="w-6 h-6 invert brightness-0" />
          </button>
          <span className="flex-1 text-center text-white font-bold text-lg">1:1 문의</span>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-400">존재하지 않는 문의입니다.</div>
        <BottomBar />
      </div>
    );
  }

  // 날짜와 시간 포맷팅
  const dateObj = new Date(inquiry.date);
  const formattedDate = `${dateObj.getFullYear()}.${(dateObj.getMonth()+1).toString().padStart(2,'0')}.${dateObj.getDate().toString().padStart(2,'0')} ${dateObj.getHours().toString().padStart(2,'0')}:${dateObj.getMinutes().toString().padStart(2,'0')}`;

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#fdfdfe] pb-16">
      {/* 상단 바 */}
      <TopBar title="1:1 문의" />

      {/* 문의 제목 및 시간 */}
      <div className="px-5 pt-20 pb-2">
        <div className="text-[#5382E0] font-bold text-base mb-1">{inquiry.title}</div>
        <div className="text-xs text-gray-400 mb-4">{formattedDate}</div>
        <span className="inline-block text-xs bg-[#5382E0] text-white rounded px-2 py-0.5 font-semibold mb-2">{inquiry.status}</span>
      </div>

      {/* 문의 내용 */}
      <div className="mx-5 mb-8 bg-[#DEE9FF] border border-[#5382E0] rounded-xl p-4 text-gray-800 text-[15px] whitespace-pre-line">
        {inquiry.content}
      </div>

      {/* 답변 */}
      {inquiry.answer && (
        <div className="mx-5 text-xs text-gray-400 mb-1 font-semibold">답변</div>
      )}
      <div className="mx-5 mb-2 bg-white border border-[#DEE9FF] rounded-xl p-4 text-gray-800 text-[15px] whitespace-pre-line">
        {inquiry.answer ? (
          <>
            {inquiry.answer}
            {inquiry.answerDate && (
              <div className="mt-3 text-xs text-gray-400">
                답변일: {(() => {
                  // answerDate가 yyyy-MM-dd HH:mm 또는 yyyy-MM-dd HH:mm:ss 등 -로 되어 있으면 .으로 변환
                  const match = inquiry.answerDate.match(/(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);
                  if (match) {
                    return `${match[1]}.${match[2]}.${match[3]} ${match[4]}:${match[5]}`;
                  }
                  return inquiry.answerDate;
                })()}
              </div>
            )}
          </>
        ) : '아직 답변이 등록되지 않았습니다.'}
      </div>
      <BottomBar />
    </div>
  );
};

export default InquiryDetailPage;
