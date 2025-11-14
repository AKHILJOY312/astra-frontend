// src/domain/useCases/auth/ForgotPasswordUseCase.ts
import { injectable, inject } from "inversify";
import type { AuthRepository } from "../../repo/AuthRepository";
import { TYPES } from "@/di/types";

@injectable()
export class ForgotPasswordUseCase {
  constructor(
    @inject(TYPES.AuthRepository) private readonly repo: AuthRepository
  ) {}

  async execute(email: string): Promise<string> {
    return this.repo.forgotPassword(email);
  }
}
