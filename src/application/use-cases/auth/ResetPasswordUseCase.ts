// src/domain/useCases/auth/ResetPasswordUseCase.ts
import { injectable, inject } from "inversify";
import type { AuthRepository } from "../../repo/AuthRepository";
import { TYPES } from "@/di/types";

@injectable()
export class ResetPasswordUseCase {
  constructor(@inject(TYPES.AuthRepository) private repo: AuthRepository) {}

  async execute(token: string, password: string): Promise<{ message: string }> {
    return this.repo.resetPassword(token, password);
  }
}
