import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const TITLE_MIN = 2;
const TITLE_MAX = 30;
const CONTENT_MIN = 5;
const CONTENT_MAX = 500;

export default function InquiryWritePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 등록 로직 (API 연동 등)
    // 성공 시 문의 내역 페이지로 이동
    navigate('/inquiry');
  };

  const isTitleValid = title.length >= TITLE_MIN && title.length <= TITLE_MAX;
  const isContentValid = content.length >= CONTENT_MIN && content.length <= CONTENT_MAX;
  const canSubmit = isTitleValid && isContentValid;

  return (
    <div className="min-h-screen bg-[#fdfdfe] flex flex-col">
      {/* 상단바 */}
      <div className="fixed left-0 top-0 right-0 z-20 flex items-center h-14 px-4 bg-[#5382E0] border-b border-[#5382E0]">
        <button className="absolute left-4" onClick={() => navigate(-1)}>
          <img src="/back.png" alt="뒤로가기" className="w-6 h-6 invert brightness-0" />
        </button>
        <div className="flex-1 text-center font-semibold text-lg text-white">1:1 문의</div>
      </div>
      {/* 폼 */}
      <form className="flex flex-col flex-1 px-4 pt-20 pb-4 max-w-md w-full mx-auto" onSubmit={handleSubmit}>
        <label className="text-sm font-medium mb-1 mt-2">제목</label>
        <input
          className="w-full border border-gray-200 rounded-lg px-3 py-3 mb-1 text-base focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength={TITLE_MAX}
        />
        <div className="flex justify-between items-center mb-3">
          <span className={`text-xs ${title.length > TITLE_MAX ? 'text-red-500' : 'text-gray-400'}`}>{title.length}/{TITLE_MAX}자</span>
          {!isTitleValid && title.length > 0 && (
            <span className="text-xs text-red-500 ml-2">{TITLE_MIN}~{TITLE_MAX}자 입력</span>
          )}
        </div>
        <label className="text-sm font-medium mb-1">내용</label>
        <textarea
          className="w-full border border-gray-200 rounded-lg px-3 py-3 mb-1 text-base min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
          placeholder="문의 내용을 입력하세요"
          value={content}
          onChange={e => setContent(e.target.value)}
          maxLength={CONTENT_MAX}
        />
        <div className="flex justify-between items-center mb-6">
          <span className={`text-xs ${content.length > CONTENT_MAX ? 'text-red-500' : 'text-gray-400'}`}>{content.length}/{CONTENT_MAX}자</span>
          {!isContentValid && content.length > 0 && (
            <span className="text-xs text-red-500 ml-2">{CONTENT_MIN}~{CONTENT_MAX}자 입력</span>
          )}
        </div>
        <div className="flex gap-3 mt-2 mb-8">
          <button
            type="button"
            className="flex-1 py-3 rounded-lg bg-gray-200 text-gray-500 text-base font-semibold"
            onClick={handleCancel}
          >
            취소
          </button>
          <button
            type="submit"
            className={`flex-1 py-3 rounded-lg text-base font-semibold transition-colors duration-150 ${canSubmit ? 'bg-[#5382E0] text-white' : 'bg-blue-100 text-blue-300'}`}
            disabled={!canSubmit}
          >
            등록
          </button>
        </div>
      </form>
    </div>
  );
} 