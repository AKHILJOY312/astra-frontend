// src/domain/useCases/auth/ResetPasswordUseCase.ts
import { injectable, inject } from "inversify";
import type { AuthRepository } from "../../repo/AuthRepository";
import { TYPES } from "@/di/types";

export interface ResetPasswordResult {
  message: string;
  role: "admin" | "user";
}

@injectable()
export class ResetPasswordUseCase {
  constructor(@inject(TYPES.AuthRepository) private repo: AuthRepository) {}

  async execute(token: string, password: string): Promise<ResetPasswordResult> {
    return this.repo.resetPassword(token, password);
  }
}
