import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import TopBar from '../components/TopBar';

const ROUTES = [
  '정부과천청사역',
  '이수역',
  '사당역',
  '금정역',
  '양재역',
];

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [email] = useState('ceni@gmail.com'); // 예시, 실제로는 props/context 등에서 받아야 함
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [routeGo, setRouteGo] = useState('');
  const [routeReturn, setRouteReturn] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [profileImg, setProfileImg] = useState('/ceni-face.webp');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pwValid = password.length === 0 || /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password);
  const pwMatch = password === confirmPassword;
  const pwRequired = password.length > 0 || confirmPassword.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password && !pwValid) {
      setError('비밀번호는 8자 이상, 영문+숫자+특수문자를 모두 포함해야 합니다.');
      return;
    }
    if (password && !pwMatch) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate(-1);
    }, 1000);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) setProfileImg(ev.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfe]">
      {/* 상단바 */}
      <TopBar title="개인정보 수정" />
      <div className="flex-1 flex flex-col items-center justify-center pt-14 pb-8">
        <form className="w-full max-w-xs flex flex-col items-center gap-3 bg-white rounded-xl shadow px-4 py-8 mt-4" onSubmit={handleSubmit}>
          {/* 프로필 이미지 */}
          <div className="flex flex-col items-center mb-2">
            <div className="w-24 h-24 rounded-full bg-[#DEE9FF] flex items-center justify-center mb-2 overflow-hidden">
              <img src={profileImg} alt="프로필" className="w-20 h-20 object-contain" />
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-[#5382E0] text-white text-sm font-semibold mt-1 mb-2 hover:bg-blue-600 transition"
              onClick={() => fileInputRef.current?.click()}
            >
              이미지 수정
            </button>
          </div>
          {/* 이메일 */}
          <label className="w-full text-sm">이메일</label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm placeholder:text-gray-400 bg-gray-100"
            value={email}
            disabled
          />
          {/* 비밀번호 */}
          <label className="w-full text-sm">비밀번호</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm placeholder:text-gray-400"
            placeholder="8자 이상, 영문+숫자+특수문자 조합"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          {/* 비밀번호 유효성 피드백 */}
          {password && !pwValid && (
            <div className="w-full text-xs text-red-500">8자 이상, 영문+숫자+특수문자를 모두 포함해야 합니다.</div>
          )}
          <label className="w-full text-sm">비밀번호 확인</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm placeholder:text-gray-400"
            placeholder="비밀번호를 한 번 더 입력해 주세요."
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
          {/* 비밀번호 확인 피드백 */}
          {confirmPassword && !pwMatch && (
            <div className="w-full text-xs text-red-500">비밀번호가 일치하지 않습니다.</div>
          )}
          {/* 즐겨찾기 노선 섹션 - 카드 스타일 제거, 구분선만 */}
          <div className="w-full border-t border-gray-200 pt-4 mt-2">
            <div className="font-bold text-base text-[#5382E0] mb-1 flex items-center">
              즐겨찾기 노선
            </div>
            <div className="text-xs text-gray-500 mb-3">출근/퇴근 시 자주 이용하는 노선을 각각 선택해 주세요.</div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm flex items-center mb-1">출근</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm bg-white"
                  value={routeGo}
                  onChange={e => setRouteGo(e.target.value)}
                >
                  <option value="">선택 안 함</option>
                  {ROUTES.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm flex items-center mb-1">퇴근</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm bg-white"
                  value={routeReturn}
                  onChange={e => setRouteReturn(e.target.value)}
                >
                  <option value="">선택 안 함</option>
                  {ROUTES.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          {/* 에러 메시지 */}
          {error && (
            <div className="w-full text-xs text-red-500 mt-[-8px] mb-1">{error}</div>
          )}
          <button
            type="submit"
            className={`w-full py-3 rounded-lg bg-[#5382E0] text-white text-base font-normal shadow hover:bg-blue-600 transition mt-10 ${(loading || (pwRequired && (!pwValid || !pwMatch))) ? 'opacity-60 cursor-not-allowed' : ''}`}
            disabled={loading || (pwRequired && (!pwValid || !pwMatch))}
          >
            {loading ? '저장 중...' : '저장'}
          </button>
        </form>
      </div>
    </div>
  );
} 