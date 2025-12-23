// src/data/api/authApi.ts
import api from "../../lib/apicaller";
import { API_ROUTES } from "./apiRoutes.constants";

export const getAllUserForAdmin = (
  page: number,
  limit: number,
  search?: string
) => api.get(API_ROUTES.ADMIN.USERS, { params: { page, limit, search } });

export const changeTheStatusOfUser = (id: string) =>
  api.patch(API_ROUTES.ADMIN.USER_STATUS(id));

export const changeTheRoleOfUser = (id: string) =>
  api.patch(API_ROUTES.ADMIN.USER_ROLE(id));
