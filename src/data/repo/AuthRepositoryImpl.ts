// src/data/repositories/AuthRepositoryImpl.ts
import type { IAuthRepository } from "../../application/repo/IAuthRepository";
import type { User } from "../../domain/entities/user/User";
import * as authApi from "../api/authApi";
import { userResponseToEntity } from "../mappers/userMapper";
import type { VerifyEmailResponse } from "@/domain/types/auth.types";

export class AuthRepositoryImpl implements IAuthRepository {
  async login(credentials: {
    email: string;
    password: string;
    isAdminLogin?: boolean;
  }) {
    const { data } = await authApi.login(credentials);

    return {
      user: userResponseToEntity(data.user),
      accessToken: data.accessToken,
    };
  }

  async register(data: any) {
    const { data: res } = await authApi.register(data);
    return { message: res.message };
  }

  async loadUser(): Promise<User> {
    const { data } = await authApi.loadMe();
    return userResponseToEntity(data.user);
  }

  async logout(): Promise<void> {
    await authApi.logout();
  }

  async forgotPassword(email: string): Promise<string> {
    const { data } = await authApi.forgotPassword(email);
    return data.message;
  }

  async resetPassword(token: string, password: string) {
    const { data } = await authApi.resetPassword(token, password);
    return { message: data.message, role: data.role as "admin" | "user" };
  }
  async verifyEmail(token: string): Promise<VerifyEmailResponse> {
    const { data } = await authApi.verifyEmail(token);
    return data;
  }
}
