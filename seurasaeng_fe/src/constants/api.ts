import { KAKAOMAP_API_BASE_URL, MOBILITY_API_BASE_URL } from "./env";

export const API = {
  mobility: {
    baseUrl: MOBILITY_API_BASE_URL,
  },
    kakaomap: {
    baseUrl: KAKAOMAP_API_BASE_URL,
  },
  websocket: {
    endpoint: '/ws',
    destination: (routeId: string) => `/app/route/${routeId}`,
    topic: (routeId: string) => `/topic/route/${routeId}`,
  },
  routes: {
    endOperation: (routeId: string) => `/route/${routeId}/end`,
    list: '/shuttles',
    listWithLocation: '/shuttles/locations',
    count: (shuttleId: string) =>  `/shuttle/count/${shuttleId}`,
    countDelete: (shuttleId: string) => `/shuttle/count/${shuttleId}`,
  },
};