import { useParams, useNavigate } from "react-router-dom";
import inquiries from "./inquiriesMock";

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
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#fdfdfe] pb-16">
      {/* 상단 바 */}
      <div className="flex items-center h-14 px-4 bg-[#5382E0] border-b border-[#5382E0] relative">
        <button className="absolute left-4" onClick={() => navigate(-1)}>
          <img src="/back.png" alt="뒤로가기" className="w-6 h-6 invert brightness-0" />
        </button>
        <span className="flex-1 text-center text-white font-bold text-lg">1:1 문의</span>
      </div>

      {/* 문의 제목 및 시간 */}
      <div className="px-5 pt-6 pb-2">
        <div className="text-[#5382E0] font-bold text-base mb-1">{inquiry.title}</div>
        <div className="text-xs text-gray-400 mb-1">{inquiry.date}</div>
        <span className="inline-block text-xs bg-[#5382E0] text-white rounded px-2 py-0.5 font-semibold mb-2">{inquiry.status}</span>
      </div>

      {/* 문의 내용 */}
      <div className="mx-5 mb-8 bg-[#DEE9FF] border border-[#5382E0] rounded-xl p-4 text-gray-800 text-[15px] whitespace-pre-line">
        {inquiry.content}
      </div>

      {/* 답변 날짜 */}
      {inquiry.answerDate && (
        <div className="mx-5 text-xs text-gray-400 mb-1">답변일: {inquiry.answerDate}</div>
      )}
      {/* 답변 */}
      <div className="mx-5 mb-2 bg-white border border-[#DEE9FF] rounded-xl p-4 text-gray-800 text-[15px] whitespace-pre-line">
        {inquiry.answer ? inquiry.answer : '아직 답변이 등록되지 않았습니다.'}
      </div>
    </div>
  );
};

export default InquiryDetailPage;
