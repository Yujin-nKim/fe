export const API = {
  websocket: {
    endpoint: "/ws",
    destination: (routeId: string) => `/app/route/${routeId}`,
  },
  routes: {
    endOperation: (routeId: string) => `/route/${routeId}/end`,
  },
};