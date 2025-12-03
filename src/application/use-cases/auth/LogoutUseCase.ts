// src/domain/useCases/auth/LogoutUseCase.ts
import { injectable, inject } from "inversify";
import type { IAuthRepository } from "../../repo/IAuthRepository";
import { TYPES } from "@/di/types"; // <-- Import the identifier

@injectable()
export class LogoutUseCase {
  constructor(
    @inject(TYPES.IAuthRepository) private readonly repo: IAuthRepository
  ) {}

  async execute(): Promise<void> {
    return this.repo.logout();
  }
}
