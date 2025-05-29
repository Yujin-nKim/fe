import { useNavigate } from 'react-router-dom';

interface BottomBarProps {
  transform?: string;
  transition?: string;
}

export default function BottomBar({ transform, transition }: BottomBarProps) {
  const navigate = useNavigate();

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex justify-around items-center px-4"
      style={{
        ...(transform && { transform }),
        ...(transition && { transition }),
      }}
    >
      <button className="flex flex-col items-center justify-center" onClick={() => navigate('/realtime')}>
        <img src="/bottom-bar/bus.png" alt="셔틀" className="w-7 h-7 mb-1" />
      </button>
      <button className="flex flex-col items-center justify-center" onClick={() => navigate('/main')}> 
        <img src="/bottom-bar/home.png" alt="홈" className="w-7 h-7 mb-1" />
      </button>
      <button className="flex flex-col items-center justify-center" onClick={() => navigate('/notice')}> 
        <img src="/bottom-bar/clip-board.png" alt="공지" className="w-7 h-7 mb-1" />
      </button>
    </nav>
  );
} 