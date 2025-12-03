// src/domain/useCases/auth/ForgotPasswordUseCase.ts
import { injectable, inject } from "inversify";
import type { IAuthRepository } from "../../repo/IAuthRepository";
import { TYPES } from "@/di/types";

@injectable()
export class ForgotPasswordUseCase {
  constructor(
    @inject(TYPES.IAuthRepository) private readonly repo: IAuthRepository
  ) {}

  async execute(email: string): Promise<string> {
    return this.repo.forgotPassword(email);
  }
}
