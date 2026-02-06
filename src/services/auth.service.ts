import api from "./api";
import { API_ROUTES } from "./apiRoutes.constants";

export const login = (credentials: {
  email: string;
  password: string;
  isAdminLogin?: boolean;
}) => {
  const endpoint = credentials.isAdminLogin
    ? API_ROUTES.ADMIN.LOGIN
    : API_ROUTES.AUTH.SESSION;

  const { ...payload } = credentials;

  return api.post(endpoint, payload);
};
export const loadMe = () => api.get(API_ROUTES.AUTH.ME);
export const logout = () => api.delete(API_ROUTES.AUTH.SESSION);

export const register = (data: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => api.post(API_ROUTES.AUTH.REGISTER, data);
export const verifyUserEmail = (token: string) =>
  api.get(API_ROUTES.AUTH.REGISTER, { params: { token } });

export const forgotUserPassword = (email: string) =>
  api.post(API_ROUTES.AUTH.RESET_PASSWORD, { email });
export const resetUserPassword = (token: string, password: string) =>
  api.put(
    API_ROUTES.AUTH.RESET_PASSWORD,
    { password, confirmPassword: password },
    { params: { token } },
  );
export const verifyResetToken = (token: string) =>
  api.get(API_ROUTES.AUTH.RESET_PASSWORD, { params: { token } });
