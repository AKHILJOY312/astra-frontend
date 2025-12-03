// src/domain/repositories/AuthRepository.ts
import type { User } from "../../domain/entities/user/User";
import type { VerifyEmailResponse } from "@/domain/types/auth.types";

export interface IAuthRepository {
  login(credentials: {
    email: string;
    password: string;
    isAdminLogin?: boolean;
  }): Promise<{ user: User; accessToken: string }>;
  register(data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): Promise<{ message: string }>;
  loadUser(): Promise<User>;
  logout(): Promise<void>;
  forgotPassword(email: string): Promise<string>;
  resetPassword(
    token: string,
    password: string
  ): Promise<{ message: string; role: "admin" | "user" }>;
  verifyEmail(token: string): Promise<VerifyEmailResponse>;
}
