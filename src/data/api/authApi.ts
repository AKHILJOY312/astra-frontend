// src/data/api/authApi.ts
import api from "../../lib/apicaller";

export const login = (credentials: { email: string; password: string }) =>
  api.post("/auth/login", credentials);

export const register = (data: any) => api.post("/auth/register", data);

export const loadMe = () => api.get("/auth/me");

export const logout = () => api.post("/auth/logout");

export const forgotPassword = (email: string) =>
  api.post("/auth/forgot-password", { email });

export const resetPassword = (token: string, password: string) =>
  api.post(
    "/auth/reset-password",
    { password, confirmPassword: password },
    { params: { token } }
  );
export const verifyEmail = (token: string) =>
  api.get(`/auth/verify-email?token=${token}`);

export const verifyResetToken = (token: string) =>
  api.get(`/auth/verify-reset-token?token=${token}`);
