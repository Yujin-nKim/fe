import type { OperationButtonsProps } from '../types/ComponentTypes';

export default function OperationButtons({ onStart, onEnd, onQrScan, isStartDisabled, isEndDisabled, isQrDisabled }: OperationButtonsProps) {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "30px" }}>
      <button onClick={onStart} disabled={isStartDisabled}>
        운행 시작 (GPS 확인)
      </button>
      <button onClick={onEnd} disabled={isEndDisabled}>
        운행 종료
      </button>
      <button onClick={onQrScan} disabled={isQrDisabled}>
        QR 스캔
      </button>
    </div>
  );
}