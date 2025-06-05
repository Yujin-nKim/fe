/** 
 * 출근/퇴근 탭의 구분 타입 
 */
export type RouteType = '출근' | '퇴근';

/**
 * 버스 노선 정보 타입
 * 
 * @property id - 노선 ID
 * @property name - 노선 이름
 */
export interface Route {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

/**
 * 출근/퇴근 각각의 노선 리스트를 담는 타입
 * 
 * @example
 * {
 *   "출근": [{ id: 1, name: "1호선" }],
 *   "퇴근": [{ id: 2, name: "2호선" }]
 * }
 */
export type RoutesResponse = {
  [key in RouteType]: Route[];
};