import { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import TopBar from '../components/TopBar';

// 임시 사용자 정보 (실제 서비스에서는 QR 데이터에서 받아와야 함)
const mockUser = {
  name: '세니',
  from: '아이티센 타워',
  to: '금정역',
};
const currentCount = 31; // 예시: 10명
const maxCount = 45; // 목 데이터

const QrScanPage = () => {
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [scanStatus, setScanStatus] = useState<'idle'|'success'|'fail'>('idle');
  const [scannedUser, setScannedUser] = useState<typeof mockUser | null>(null);
  const [scanTime, setScanTime] = useState<Date | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const isScanningRef = useRef(true);
  const hasStartedRef = useRef(false);

  // 카메라 권한 확인
  useEffect(() => {
    const checkCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        setCameraPermission(true);
      } catch {
        setCameraPermission(false);
      }
    };
    checkCameraPermission();
  }, []);

  // 최초 1회만 스캐너 생성/시작
  useEffect(() => {
    if (!cameraPermission) return;
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    const startScanner = async () => {
      const html5QrCode = new Html5Qrcode("reader");
      isScanningRef.current = true;
      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length) {
        let selectedCamera = null;
        selectedCamera = devices.find(device => {
          const label = device.label.toLowerCase();
          return label.includes('facing back') && label.includes('0');
        });
        if (!selectedCamera) {
          selectedCamera = devices.find(device => device.label.toLowerCase().includes('facing back'));
        }
        const cameraId = selectedCamera ? selectedCamera.id : devices[0].id;
        await html5QrCode.start(
          cameraId,
          {
            fps: 10,
            aspectRatio: 1.0,
          },
          (decodedText) => {
            if (!isScanningRef.current) return;
            if (!decodedText || decodedText.trim() === '') return;
            isScanningRef.current = false;
            setScannedUser(mockUser);
            setScanTime(new Date());
            setScanStatus('success');
            if (window.navigator.vibrate) {
              window.navigator.vibrate(200);
            }
          },
          () => {
            // 실패 콜백에서는 아무 처리도 하지 않음
          }
        );
        setCameraReady(true); // 카메라 준비 완료
      } else {
        setScanStatus('fail');
      }
    };
    startScanner();
    return () => {
      hasStartedRef.current = false;
    };
  }, [cameraPermission]);

  // 성공/실패 후 2.5초 후 idle로 복귀
  useEffect(() => {
    if (scanStatus === 'success' || scanStatus === 'fail') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        setScannedUser(null);
        setScanTime(null);
        setScanStatus('idle');
        isScanningRef.current = true;
      }, 2500);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [scanStatus]);

  // 색상 결정 함수
  const getCountColor = (count: number) => {
    if (count <= 15) return 'text-green-600';
    if (count <= 30) return 'text-orange-500';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-[#fdfdfe] pb-16">
      {/* 상단바 */}
      <TopBar title="QR 코드 스캔" />
      {/* 카메라 영역만 w-full, 패딩/마진 없이 */}
      <div className="relative w-full mt-14"> {/* relative로 오버레이 기준 */}
        <div
          id="reader"
          className={`${scanStatus === 'success' ? 'border-4 border-green-500' : scanStatus === 'fail' ? 'border-4 border-red-500' : ''}`}
          style={{ minHeight: '300px' }}
        >
        </div>
        {/* 중앙 십자(+) 가이드와 L자 가이드 */}
        {cameraReady && scanStatus === 'idle' && (
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999]">
            {/* 중앙 십자(+) */}
            <svg width="36" height="36">
              <line x1="18" y1="10" x2="18" y2="26" stroke="#5382E0" strokeWidth="1" strokeLinecap="round"/>
              <line y1="18" x1="10" y2="18" x2="26" stroke="#5382E0" strokeWidth="1" strokeLinecap="round"/>
            </svg>
            {/* L자 가이드 (SVG 크기만큼 오프셋, 더 가깝게 -6px) */}
            <svg className="absolute left-[-6px] top-[-6px]" width="32" height="32">
              <polyline points="0,16 0,0 16,0" fill="none" stroke="#5382E0" strokeWidth="4" strokeLinejoin="round"/>
            </svg>
            <svg className="absolute right-[-6px] top-[-6px]" width="32" height="32">
              <polyline points="16,0 32,0 32,16" fill="none" stroke="#5382E0" strokeWidth="4" strokeLinejoin="round"/>
            </svg>
            <svg className="absolute left-[-6px] bottom-[-6px]" width="32" height="32">
              <polyline points="0,16 0,32 16,32" fill="none" stroke="#5382E0" strokeWidth="4" strokeLinejoin="round"/>
            </svg>
            <svg className="absolute right-[-6px] bottom-[-6px]" width="32" height="32">
              <polyline points="16,32 32,32 32,16" fill="none" stroke="#5382E0" strokeWidth="4" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
        {/* 오버레이: 체크 + 완료 텍스트 */}
        {scanStatus === 'success' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none">
            <div className="bg-white/80 rounded-xl px-6 py-4 flex flex-col items-center shadow-lg">
              {/* SVG 아이콘 */}
              <svg
                className="w-20 h-20 mb-2"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="32" cy="32" r="32" fill="#4ADE80" />
                <path
                  d="M20 33L29 42L44 25"
                  stroke="white"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="text-2xl font-bold text-green-700 drop-shadow-lg">인증 완료!</div>
            </div>
          </div>
        )}
        {/* 오버레이: 인증 실패 */}
        {scanStatus === 'fail' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none">
            <div className="bg-white/80 rounded-xl px-6 py-4 flex flex-col items-center shadow-lg">
              {/* X 아이콘 (SVG) */}
              <svg className="w-20 h-20 mb-2" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="32" fill="#F87171" />
                <path d="M22 22L42 42M42 22L22 42" stroke="white" strokeWidth="5" strokeLinecap="round"/>
              </svg>
              <div className="text-2xl font-bold text-red-700 drop-shadow-lg">인증 실패</div>
            </div>
          </div>
        )}
      </div>
      {/* 안내/정보 영역은 별도 flex 컨테이너로 */}
      <div className="flex flex-col items-center justify-center">
        {cameraPermission === false && (
          <div className="mb-4 p-4 bg-yellow-100 text-yellow-700 rounded-lg w-full max-w-md">
            카메라 접근 권한을 허용해주세요.
          </div>
        )}
        {/* 사용자 정보 mock 데이터 표시 */}
        <div className="w-full min-h-[70px] flex flex-col items-center justify-center mt-4 mb-2">
          {scanStatus === 'success' && scannedUser ? (
            <div className="flex flex-col items-center animate-fade-in">
              <div className="text-lg font-bold text-[#5382E0] mb-1">{scannedUser.name}</div>
              <div className="text-base text-gray-700 mb-1">{scannedUser.from} → {scannedUser.to}</div>
              {scanTime && (
                <div className="text-xs text-gray-400 mt-1">
                  {scanTime.toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                  })}
                </div>
              )}
            </div>
          ) : scanStatus === 'fail' ? (
            <div className="text-base text-red-500 font-semibold text-center">
              QR 코드 인식에 실패했습니다.<br />다시 시도해 주세요.
            </div>
          ) : cameraReady ? (
            <div className="text-base text-sm font-medium text-center">
              QR 코드를 스캔해주세요.
            </div>
          ) : null}
        </div>
      </div>
      {/* 하단 고정 보안 안내 → 탑승 인원 표시 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#fdfdfe]">
        <div className="text-xl text-center w-full max-w-md mx-auto">
          <span>탑승 인원: </span>
          <span className={getCountColor(currentCount)}>{currentCount}</span>
          <span> / {maxCount}</span>
        </div>
      </div>
    </div>
  );
};

export default QrScanPage;
