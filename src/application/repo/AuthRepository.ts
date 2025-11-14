// src/domain/repositories/AuthRepository.ts
import type { User } from "../../domain/entities/user/User";
import type { VerifyEmailResponse } from "@/domain/types/auth.types";

export interface AuthRepository {
  login(credentials: {
    email: string;
    password: string;
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
  resetPassword(token: string, password: string): Promise<{ message: string }>;
  verifyEmail(token: string): Promise<VerifyEmailResponse>;
}
