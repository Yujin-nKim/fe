export interface GpsPayload {
  routeId: string;
  type: "RUNNING" | "END";
  latitude: number;
  longitude: number;
  timestamp: string;
};