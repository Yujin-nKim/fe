import React from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col justify-between items-center bg-white pt-6 pb-4">
      {/* 뒤로가기 버튼 */}
      <button
        className="absolute top-4 left-4 z-10 p-2"
        onClick={() => navigate(-1)}
        aria-label="뒤로가기"
      >
        <img src="/back.png" alt="뒤로가기" className="w-7 h-7" />
      </button>
      <div className="w-full flex flex-col items-center">
        <h2 className="text-2xl font-bold text-center mb-4">로그인</h2>
        <img
          src="/ceni.webp"
          alt="캐릭터"
          className="w-32 h-32 object-contain mb-6 mt-24"
        />
        <form className="w-full max-w-xs flex flex-col gap-3 mt-12">
          <label className="text-sm font-normal text-black">이메일</label>
          <input
            type="email"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="ceni@itcen.com"
          />
          <label className="text-sm font-normal text-black">비밀번호</label>
          <input
            type="password"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="비밀번호를 입력하세요."
          />
          <a
            href="#"
            className="mt-2 text-sm text-gray-700 underline underline-offset-2"
          >
            비밀번호를 잊으셨나요?
          </a>
        </form>
        <button
          type="submit"
          className="w-[90%] py-3 rounded-lg bg-blue-400 text-white text-base font-normal shadow hover:bg-blue-500 transition z-20 mb-8 mt-20"
        >
          로그인
        </button>
      </div>
    </div>
  );
} 