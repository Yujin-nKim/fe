export type TimetableItem = {
  거점: string;
  차량규격: string;
  소요시간: string;
  승차장소?: string;
  하차장소?: string;
  출발시간: { [key: string]: string }[];
};

export interface ShuttleScheduleJson {
  출근: TimetableItem[];
  퇴근: TimetableItem[];
}
