import api from "./api";
import { API_ROUTES } from "./apiRoutes.constants";

export const fetchAdminDashboardApi = () => api.get(API_ROUTES.ADMIN.DASHBOARD);

export const fetchBillingListApi = (params: {
  page: number;
  limit: number;
  search?: string;
}) => api.get(API_ROUTES.ADMIN.BILLING, { params });

export const fetchBillDetailsApi = (payload: { userId: string }) =>
  api.post(API_ROUTES.ADMIN.BILLING, payload);

export const fetchAdminDashboardChartApi = (params?: { period?: string }) =>
  api.get(API_ROUTES.ADMIN.ANALYTICS, { params });
