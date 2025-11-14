// src/domain/useCases/auth/LogoutUseCase.ts
import { injectable, inject } from "inversify";
import type { AuthRepository } from "../../repo/AuthRepository";
import { TYPES } from "@/di/types"; // <-- Import the identifier

@injectable()
export class LogoutUseCase {
  constructor(
    @inject(TYPES.AuthRepository) private readonly repo: AuthRepository
  ) {}

  async execute(): Promise<void> {
    return this.repo.logout();
  }
}
