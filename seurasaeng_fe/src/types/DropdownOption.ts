export interface DropdownOption {
  value: string; // 항목의 고유한 값, <option value="..."> 에 사용
  label: string; // 드롭다운에 표시될 이름
  departure: string; // 출발지 (예: 사당, 양재, 아이티센 타워)
  destination: string; // 도착지 (예: 사당, 양재, 아이티센 타워)
  boarding_location: string; // 탑승 장소 (예: 정부과천청사역 7번 출구, 아이티센 타워 G 앞 )
  dropoff_location: string; // 하차 장소 (예: 정부과천청사역 7번 출구, 아이티센 타워 G 앞 )
  is_commute: string; // 출,퇴근 여부
  duration_minutes: string; // 소요 시간 
  total_seats: string; // 버스 정원
}
// 드롭다운 항목을 위한 데이터 구조 정의