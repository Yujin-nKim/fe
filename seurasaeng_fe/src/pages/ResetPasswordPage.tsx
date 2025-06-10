import { useNavigate } from "react-router-dom";
import { useState } from "react";
import TopBar from '../components/TopBar';

function validatePassword(pw: string) {
  // 8자 이상, 영문+숫자+특수문자
  return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(pw);
}

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const pwValid = validatePassword(password);
  const pwMatch = password === confirmPassword && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!pwValid) {
      setError("8자 이상, 영문/숫자+특수문자를 모두 포함해야 합니다.");
      return;
    }
    if (!pwMatch) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    setLoading(true);
    // 비밀번호 변경 요청 (여기선 mock)
    setTimeout(() => {
      setLoading(false);
      navigate('/main'); // 성공 시 바로 메인 페이지로 이동
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfe]">
      {/* 상단바 */}
      <TopBar title="비밀번호 재설정" />
      {/* 중앙 컨텐츠 */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-xs mx-auto flex flex-col items-center bg-white rounded-xl shadow px-4 py-8 gap-4">
          {/* 안내문구 */}
          <div className="text-[#5382E0] text-sm font-semibold text-center mb-10">
            새 비밀번호를 입력해 주세요.
          </div>
          {/* 입력폼 */}
          <form className="w-full flex flex-col gap-3" onSubmit={handleSubmit}>
            <label className="text-sm font-normal text-[#5382E0]">비밀번호</label>
            <input
              type="password"
              className="border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm placeholder:text-gray-400 text-base appearance-none"
              placeholder="8자 이상, 영문+숫자+특수문자 조합"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            {/* 비밀번호 조건 피드백 */}
            {password.length > 0 && !pwValid && (
              <div className="text-xs text-red-500 mt-[-8px] mb-1">8자 이상, 영문/숫자+특수문자를 모두 포함해야 합니다.</div>
            )}
            <label className="text-sm font-normal text-[#5382E0]">비밀번호 확인</label>
            <input
              type="password"
              className="border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm placeholder:text-gray-400 text-base appearance-none"
              placeholder="비밀번호를 한 번 더 입력해 주세요."
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
            {/* 비밀번호 일치 피드백 */}
            {confirmPassword.length > 0 && !pwMatch && (
              <div className="text-xs text-red-500 mt-[-8px] mb-1">비밀번호가 일치하지 않습니다.</div>
            )}
            {/* 에러 메시지 */}
            {error && (
              <div className="text-sm text-red-500 text-center mb-2 w-full">{error}</div>
            )}
            <button
              type="submit"
              className={`mt-20 w-full py-3 rounded-lg bg-[#5382E0] text-white text-base font-normal shadow hover:bg-blue-600 transition mt-6 mb-2 ${loading || !pwValid || !pwMatch ? 'opacity-60 cursor-not-allowed' : ''}`}
              disabled={loading || !pwValid || !pwMatch}
            >
              {loading ? '처리 중...' : '확인'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 