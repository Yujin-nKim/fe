interface OperationButtonsProps {
  onStart: () => void; // 운행 시작 버튼 클릭 핸들러
  onEnd: () => void; // 운행 종료 버튼 클릭 핸들러
  onQrScan: () => void; // QR 스캔 버튼 클릭 핸들러
  isStartDisabled: boolean; // 운행 시작 버튼 비활성화 여부
  isEndDisabled: boolean; // 운행 종료 버튼 비활성화 여부
  isQrDisabled: boolean; // QR 스캔 버튼 비활성화 여부
}

export function OperationButtons(props: OperationButtonsProps) {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "30px" }}>
      <button onClick={props.onStart} disabled={props.isStartDisabled}>
        운행 시작 (GPS 확인)
      </button>
      <button onClick={props.onEnd} disabled={props.isEndDisabled}>
        운행 종료
      </button>
      <button onClick={props.onQrScan} disabled={props.isQrDisabled}>
        QR 스캔
      </button>
    </div>
  );
}