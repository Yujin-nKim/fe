export interface DropdownOption {
  value: string; // 항목의 고유한 값, <option value="..."> 에 사용
  label: string; // 드롭다운에 표시될 이름
  departure: string; // 출발지 (예: 사당, 양재, 아이티센 타워)
  destination: string; // 도착지 (예: 사당, 양재, 아이티센 타워)
  is_commute: string; // 출,퇴근 여부
}
// 드롭다운 항목을 위한 데이터 구조 정의