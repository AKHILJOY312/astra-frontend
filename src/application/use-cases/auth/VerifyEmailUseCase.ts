// src/domain/useCases/auth/VerifyEmailUseCase.ts
import { injectable, inject } from "inversify";
import type { AuthRepository } from "../../repo/AuthRepository";
import { TYPES } from "@/di/types";

@injectable()
export class VerifyEmailUseCase {
  constructor(@inject(TYPES.AuthRepository) private repo: AuthRepository) {}

  async execute(token: string): Promise<{ message: string }> {
    return this.repo.verifyEmail(token);
  }
}
