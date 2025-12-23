// src/data/api/authApi.ts
import api from "../../lib/apicaller";
import { API_ROUTES } from "./apiRoutes.constants";

export const login = (credentials: {
  email: string;
  password: string;
  isAdminLogin?: boolean;
}) => {
  const endpoint = credentials.isAdminLogin
    ? API_ROUTES.ADMIN.LOGIN
    : API_ROUTES.AUTH.LOGIN;

  const { ...payload } = credentials;

  return api.post(endpoint, payload);
};

export const register = (data: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => api.post(API_ROUTES.AUTH.REGISTER, data);

export const loadMe = () => api.get(API_ROUTES.AUTH.ME);

export const logout = () => api.post(API_ROUTES.AUTH.LOGOUT);

export const forgotPassword = (email: string) =>
  api.post(API_ROUTES.AUTH.FORGOT_PASSWORD, { email });

export const resetPassword = (token: string, password: string) =>
  api.post(
    API_ROUTES.AUTH.RESET_PASSWORD,
    { password, confirmPassword: password },
    { params: { token } }
  );
export const verifyEmail = (token: string) =>
  api.get(API_ROUTES.AUTH.VERIFY_EMAIL, { params: { token } });

export const verifyResetToken = (token: string) =>
  api.get(API_ROUTES.AUTH.VERIFY_RESET_TOKEN, { params: { token } });
