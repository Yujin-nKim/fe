import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-between items-center bg-[#fdfdfe] pt-6 pb-4 min-h-full">
      {/* 뒤로가기 버튼 */}
      <button
        className="absolute top-4 left-4 z-10 p-2"
        onClick={() => navigate(-1)}
        aria-label="뒤로가기"
      >
        <img src="/back.png" alt="뒤로가기" className="w-7 h-7" />
      </button>
      <div className="w-full flex flex-col items-center">
        <h2 className="text-xl font-bold text-center mb-6">회원가입</h2>
        <form className="w-full flex flex-col gap-4 mt-8 pb-4 px-4">
          {/* 이메일 */}
          <label className="text-sm font-normal text-black">이메일</label>
          <div className="flex gap-2 w-full">
            <input
              type="email"
              className="flex-1 min-w-0 border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder:text-gray-400 text-base appearance-none"
              placeholder="example@itcen.com"
            />
            <button type="button" className="flex-shrink-0 min-w-[72px] px-2 py-3 rounded-lg bg-blue-400 text-white text-sm font-normal hover:bg-blue-500 transition text-base appearance-none">중복확인</button>
          </div>
          {/* 인증 코드 확인 */}
          <label className="text-sm font-normal text-black">인증 코드 확인</label>
          <div className="flex gap-2 w-full">
            <input
              type="text"
              className="flex-1 min-w-0 border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder:text-gray-400 text-base appearance-none"
              placeholder="인증 코드 입력"
            />
            <button type="button" className="flex-shrink-0 min-w-[60px] px-2 py-3 rounded-lg bg-blue-400 text-white text-sm font-normal hover:bg-blue-500 transition text-base appearance-none">확인</button>
          </div>
          {/* 이름 */}
          <label className="text-sm font-normal text-black">이름</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder:text-gray-400 text-base appearance-none"
            placeholder="이름을 입력해주세요."
          />
          {/* 비밀번호 */}
          <label className="text-sm font-normal text-black">비밀번호</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder:text-gray-400 text-base appearance-none"
            placeholder="8자리 이상, 영문+숫자+특수문자"
          />
          {/* 비밀번호 확인 */}
          <label className="text-sm font-normal text-black">비밀번호 확인</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder:text-gray-400 text-base appearance-none"
            placeholder="비밀번호를 한번 더 입력해주세요"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-blue-400 text-white text-base font-normal shadow hover:bg-blue-500 transition mt-8"
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
}
