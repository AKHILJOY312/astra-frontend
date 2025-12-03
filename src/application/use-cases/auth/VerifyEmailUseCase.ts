// src/domain/useCases/auth/VerifyEmailUseCase.ts
import { injectable, inject } from "inversify";
import type { IAuthRepository } from "../../repo/IAuthRepository";
import { TYPES } from "@/di/types";

@injectable()
export class VerifyEmailUseCase {
  constructor(@inject(TYPES.IAuthRepository) private repo: IAuthRepository) {}

  async execute(token: string): Promise<{ message: string }> {
    return this.repo.verifyEmail(token);
  }
}
