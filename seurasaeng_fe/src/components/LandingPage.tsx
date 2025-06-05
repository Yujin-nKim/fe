import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-between items-center bg-[#fdfdfe] pt-12 pb-8">
      <div className="flex flex-col items-center w-full">
        <p className="text-xs text-blue-300 mb-8">특별한 우리들의 평범한 매일</p>
        <h1 className="text-3xl font-bold text-center leading-tight mb-2">
          슬기로운<br />
          <span className="tracking-wider">아이티센 생활<sup className="text-xs align-super">+</sup></span>
        </h1>
        <img
          src="/ceni-bus-blue.webp"
          alt="셔틀버스"
          className="w-40 h-auto mx-auto my-4 drop-shadow-md mt-32"
        />
        <div className="text-center text-base text-gray-500 mb-2 mt-12">-셔틀편-</div>
      </div>
      <div className="w-full flex flex-col gap-3 px-6 mt-8">
        <button
          className="w-full py-3 rounded-lg bg-[#5382E0] text-white text-base font-normal shadow hover:bg-blue-600 transition"
          onClick={() => navigate('/register')}
        >
          회원가입
        </button>
        <button
          className="w-full py-3 rounded-lg border border-[#5382E0] text-[#5382E0] text-base font-normal bg-white hover:bg-blue-50 transition"
          onClick={() => navigate('/login')}
        >
          로그인
        </button>
        <button
          className="w-full py-3 rounded-lg border border-gray-400 text-gray-700 text-base font-normal bg-white hover:bg-gray-50 transition mt-2"
          onClick={() => navigate('/main')}
        >
          메인 페이지 테스트
        </button>
      </div>
    </div>
  );
}
