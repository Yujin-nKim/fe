import type { ChangeEvent } from "react";
import type { DropdownOption } from "../types/DropdownOption";

interface DropdownProps {
  options: DropdownOption[]; // 드롭다운에 들어갈 옵션 리스트
  selectedValue: string; // 현재 선택된 값
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void; // 선택 변경 핸들러
  disabled?: boolean; // 비활성화 여부 (선택적)
}

export default function Dropdown(props: DropdownProps) {
  return (
    <select
      value={props.selectedValue}
      onChange={props.onChange}
      disabled={props.disabled}
    >
      {props.options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}