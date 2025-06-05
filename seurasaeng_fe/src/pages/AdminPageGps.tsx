import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { useGeoLocation } from "../hooks/useGeoLocation";
import { useSocket } from "../hooks/useSocketSend";
import { getKstTimestamp } from "../utils/getKstTimestamp";
import { Dropdown } from "../components/Dropdown";
import { OperationButtons } from "../components/OperationButtons";
import { API } from "../constants/api";
import type { GpsPayload } from "../types/GpsPayload";
import type { DropdownOption } from "../types/DropdownOption";
import apiClient from "../libs/axios";


// TODO: 테스트용 노선 데이터  - API 연동 후 실제 데이터로 교체할 것
/**
 * 테스트용 노선 데이터
 * 
 * API 연동 전까지 임시로 사용되는 데이터
 * 
 */
const initialOptions: DropdownOption[] = [
      {
    value: "0",
    label: "선택해주세요.",
    departure: "",
    destination: "",
    boarding_location: "",
    dropoff_location: "",
    is_commute: "",
    duration_minutes: "",
    total_seats: "",
  },
  {
    value: "1",
    label: "사당 → 아이티센 타워",
    departure: "사당",
    destination: "아이티센 타워",
    boarding_location: "사당역 1번 출구 앞",
    dropoff_location: "아이티센 타워 G 앞",
    is_commute: "출근",
    duration_minutes: "45",
    total_seats: "40",
  },
  {
    value: "2",
    label: "양재 → 아이티센 타워",
    departure: "양재",
    destination: "아이티센 타워",
    boarding_location: "양재역 12번 출구 버스정류장",
    dropoff_location: "아이티센 타워 G 앞",
    is_commute: "출근",
    duration_minutes: "35",
    total_seats: "40",
  },
  {
    value: "3",
    label: "아이티센 타워 → 정부과천청사역",
    departure: "아이티센 타워",
    destination: "정부과천청사역",
    boarding_location: "아이티센 타워 G 앞",
    dropoff_location: "정부과천청사역 7번 출구 앞",
    is_commute: "퇴근",
    duration_minutes: "40",
    total_seats: "40",
  }
];

function AdminPage() {
  // 인터벌 ID 저장
  const intervalRef = useRef<number | null>(null);
  // 마지막 수집된 GPS 데이터 저장 
  const latestGpsRef = useRef<GpsPayload | null>(null);
  // 선택된 노선 ID
  const [selectedValue, setSelectedValue] = useState<string>(initialOptions[0].value);
  // 운행 중 여부 
  const [isOperating, setIsOperating] = useState<boolean>(false);
  // 현재 상태 메시지
  const [operationMessage, setOperationMessage] = useState<string>("현재 운행 중이 아닙니다.");
  // 현재 GPS 정보
  const [currentGpsInfo, setCurrentGpsInfo] = useState<string | null>(null);

  // GPS 위치 수집 hook
  const { location, error, isLoading, fetchLocation } = useGeoLocation();


      const handleMaxRetryExceeded = () => {
              console.log("재연결 실패로 운행 종료 처리");

    // GPS 수집 인터벌 정리
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setIsOperating(false);
    setOperationMessage("네트워크 오류로 운행이 종료되었습니다. 다시 시작해주세요.");
  };

    // WebSocket 연결 hook
  const { stompClientRef, connectSocket, disconnectSocket } = useSocket(handleMaxRetryExceeded);

  // 노선 선택 변경 핸들러
  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(event.target.value);

    // 운행 중이 아니면 상태 초기화
    if (!isOperating) {
      setCurrentGpsInfo(null);
      setOperationMessage("현재 운행 중이 아닙니다.");
    }
  };

  // 운행 시작 버튼 핸들러
  const handleStartOperation = () => {
    if (!selectedValue || selectedValue === "0") {
      alert("운행을 시작할 노선을 선택해주세요.");
      return;
    }

    if (window.confirm("GPS 정보를 사용하여 운행을 시작하시겠습니까?")) {
      connectSocket().then(() => {
        setIsOperating(true);
        setOperationMessage("GPS 정보 가져오는 중...");
        setCurrentGpsInfo(null);

        fetchLocation();

        intervalRef.current = setInterval(() => {
          fetchLocation();
          console.log("[자동 GPS 요청] fetchLocation() 실행됨");
        }, 3000);
      })
      .catch((error) => {
        console.error("WebSocket 연결 실패:", error);
        setOperationMessage("네트워크 연결 실패: 페이지를 새로고침 해주세요.");
      });
    } else {
      setOperationMessage("운행이 취소되었습니다.");
      setIsOperating(false);
    }
  };

  // 운행 종료 버튼 핸들러
  const handleEndOperation = async () => {
    // GPS 수집 인터벌 정리
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // 서버에 운행 종료 API 호출
    try {
      await apiClient.post(API.routes.endOperation(selectedValue));
      console.log("운행 종료 API 호출 완료");
    } catch (err) {
      console.error("운행 종료 API 호출 실패", err);
    }

    disconnectSocket(); // WebSocket 연결 종료
    setIsOperating(false);
    setOperationMessage("운행이 종료되었습니다. 다시 시작하려면 노선 선택 후 운행 시작 버튼을 누르세요.");
    setCurrentGpsInfo(null);
  };

  // QR 스캔 버튼 핸들러
  const handleQrScan = () => {
    console.log("QR 스캔 버튼 클릭됨");
    alert("QR 스캔 실행!");
  };

  // GPS 수집 결과에 따라 UI 상태 업데이트
  useEffect(() => {

    // 초기 상태
    if (!isOperating && !isLoading && !location && !error) {
      setOperationMessage("현재 운행 중이 아닙니다.");
      setCurrentGpsInfo(null);
      return;
    }

    // GPS 정보 가져오는 중
    if (isLoading) {
      setOperationMessage("GPS 정보 가져오는 중...");
      setCurrentGpsInfo("로딩 중...");

    // GPS 요청 실패
    } else if (error) {
      setOperationMessage(`GPS 오류: ${error}`);
      setCurrentGpsInfo(`오류: ${error}`);
      setIsOperating(false);

    // GPS 위치 정상 수집 완료
    } else if (location && isOperating) {

      const gpsPayload: GpsPayload = {
        routeId: selectedValue,
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: getKstTimestamp(),
      };

      latestGpsRef.current = gpsPayload;

      if (stompClientRef.current?.connected) {
        stompClientRef.current.publish({
          destination: API.websocket.destination(selectedValue),
          body: JSON.stringify(gpsPayload),
        });
        console.log("소켓 전송됨:", gpsPayload);
      } else {
        console.warn("소켓 연결되지 않음");
      }

      setOperationMessage("운행중");
      setCurrentGpsInfo(null);
    }
  }, [location, error, isLoading, isOperating, selectedValue]);

  // 현재 선택된 노선 객체 가져옴
  const selectedOption = initialOptions.find(option => option.value === selectedValue);

  // 버튼 활성화 조건
  const isStartDisabled = isOperating || isLoading || !selectedValue;
  const isEndDisabled = !isOperating;

  return (
    <div className="DropdownAppContainer" style={{ padding: "20px", maxWidth: "700px", margin: "auto", textAlign: "center" }}>
      <h1>관리자 페이지 - GPS 위치 확인 (요청 시)</h1>

      {/* 운행 노선 선택 드롭다운 */}
      <div style={{ marginBottom: "20px" }}>
        <p>운행 노선 선택</p>
        <Dropdown options={initialOptions} selectedValue={selectedValue} onChange={handleSelectChange} disabled={isOperating || isLoading} />
      </div>

      {/* 선택한 노선 상세 정보 표시 */}
      {selectedOption && selectedValue !== "0" && !isOperating && !isLoading && (
        <div style={{ margin: "20px auto", border: "1px solid #ccc", padding: "15px", borderRadius: "5px", maxWidth: "500px", textAlign: "left" }}>
          <h2>노선 정보:</h2>
          <p><strong>출발지:</strong> {selectedOption.departure}</p>
          <p><strong>도착지:</strong> {selectedOption.destination}</p>
          <p><strong>소요시간:</strong> {selectedOption.duration_minutes}분</p>
          <p><strong>버스 정원:</strong> {selectedOption.total_seats}명</p>
        </div>
      )}

      {/* 운행 제어 버튼 영역 */}
      <OperationButtons
        onStart={handleStartOperation}
        onEnd={handleEndOperation}
        onQrScan={handleQrScan}
        isStartDisabled={isStartDisabled}
        isEndDisabled={isEndDisabled}
        isQrDisabled={!isOperating || isLoading}
      />

      {/* 현재 운행 상태 및 GPS 정보 표시 영역 */}
      <div style={{ marginTop: "30px", border: "1px solid #eee", padding: "20px", borderRadius: "5px", background: "#f9f9f9" }}>
        <h2>운행 상태 및 GPS 정보</h2>
        <p style={{ fontWeight: "bold", minHeight: "20px" }}>{operationMessage}</p>
        {(isOperating || isLoading) && (
          currentGpsInfo ? (
            <div style={{ marginTop: "10px", padding: "10px", background: "white", border: "1px solid #ddd", borderRadius: "4px" }}>
              <strong>현재 GPS 위치:</strong>
              <p style={{ fontSize: "1.1em", color: "#333", wordBreak: "break-all" }}>{currentGpsInfo}</p>
            </div>
          ) : (
            isLoading && <p>GPS 정보를 가져오는 중...</p>
          )
        )}
      </div>
    </div>
  );
}

export default AdminPage;