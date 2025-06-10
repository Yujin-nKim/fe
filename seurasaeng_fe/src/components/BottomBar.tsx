import { useNavigate, useLocation } from 'react-router-dom';
import { HiHome, HiClipboardDocumentList } from 'react-icons/hi2';
import { FaBusAlt } from 'react-icons/fa';
import type { BottomBarProps } from '../types/ComponentTypes';

export default function BottomBar({ transform, transition }: BottomBarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // 경로별 활성화 여부
  const isShuttle = location.pathname === '/realtime-shuttle';
  const isHome = location.pathname === '/main';
  const isNotice = location.pathname.startsWith('/notice');

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex justify-around items-center px-4 z-45"
      style={{
        ...(transform && { transform }),
        ...(transition && { transition }),
      }}
    >
      <button className="flex flex-col items-center justify-center" onClick={() => navigate('/realtime-shuttle')}>
        <FaBusAlt size={28} color={isShuttle ? '#5382E0' : '#B0B0B0'} />
        <span className={`text-xs mt-0.5 ${isShuttle ? 'text-[#5382E0] font-bold' : 'text-[#B0B0B0]'}`}>셔틀</span>
      </button>
      <button className="flex flex-col items-center justify-center" onClick={() => navigate('/main')}> 
        <HiHome size={28} color={isHome ? '#5382E0' : '#B0B0B0'} />
        <span className={`text-xs mt-0.5 ${isHome ? 'text-[#5382E0] font-bold' : 'text-[#B0B0B0]'}`}>홈</span>
      </button>
      <button className="flex flex-col items-center justify-center" onClick={() => navigate('/notice')}> 
        <HiClipboardDocumentList size={28} color={isNotice ? '#5382E0' : '#B0B0B0'} />
        <span className={`text-xs mt-0.5 ${isNotice ? 'text-[#5382E0] font-bold' : 'text-[#B0B0B0]'}`}>공지</span>
      </button>
    </nav>
  );
} 