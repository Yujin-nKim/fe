import React, { useRef, useEffect } from 'react';

interface SlideTabProps {
  locations: string[];
  locationIdx: number;
  onLocationChange: (idx: number) => void;
  tab: '출근' | '퇴근';
  onTabChange: (tab: '출근' | '퇴근') => void;
  className?: string;
  style?: React.CSSProperties;
}

const TYPES: ('출근' | '퇴근')[] = ['출근', '퇴근'];

export default function SlideTab({
  locations,
  locationIdx,
  onLocationChange,
  tab,
  onTabChange,
  className = '',
  style = {},
}: SlideTabProps) {
  const locationTabRef = useRef<HTMLDivElement>(null);
  const selectedBtnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const btn = selectedBtnRefs.current[locationIdx];
    if (btn && locationTabRef.current) {
      btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [locationIdx]);

  const handlePrev = () => {
    onLocationChange((locationIdx - 1 + locations.length) % locations.length);
  };
  const handleNext = () => {
    onLocationChange((locationIdx + 1) % locations.length);
  };

  return (
    <div className={className} style={style}>
      <style>{`
        .timetable-no-scrollbar::-webkit-scrollbar { display: none; }
        .timetable-no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      {/* 거점 슬라이드 탭 */}
      <div className="flex items-center justify-center w-full mb-2 select-none">
        <button onClick={handlePrev} className="pl-6 pr-3 py-1 text-[#5382E0] text-lg font-bold" aria-label="이전 거점">&#60;</button>
        <div
          ref={locationTabRef}
          className="flex gap-2 flex-nowrap w-full max-w-full overflow-x-auto timetable-no-scrollbar"
          style={{ scrollBehavior: 'smooth' }}
        >
          {locations.map((loc, idx) => (
            <button
              key={loc}
              ref={el => { selectedBtnRefs.current[idx] = el; }}
              className={`px-4 py-1 rounded-full border text-sm font-semibold whitespace-nowrap flex-shrink-0 ${locationIdx === idx ? 'bg-[#5382E0] text-white border-[#5382E0]' : 'bg-white text-[#5382E0] border-[#5382E0]'}`}
              style={{ minWidth: 'fit-content' }}
              onClick={() => onLocationChange(idx)}
            >
              {loc}
            </button>
          ))}
        </div>
        <button onClick={handleNext} className="pr-6 pl-3 py-1 text-[#5382E0] text-lg font-bold" aria-label="다음 거점">&#62;</button>
      </div>
      {/* 출근/퇴근 탭 */}
      <div className="flex justify-center gap-2 mb-6">
        {TYPES.map((t) => (
          <button
            key={t}
            className={`px-4 py-1 rounded-full border text-sm font-semibold ${tab === t ? 'bg-[#5382E0] text-white border-[#5382E0]' : 'bg-white text-[#5382E0] border-[#5382E0]'}`}
            onClick={() => onTabChange(t)}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
} 