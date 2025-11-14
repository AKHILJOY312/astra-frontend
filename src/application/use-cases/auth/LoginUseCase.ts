// src/domain/useCases/auth/LoginUseCase.ts
import { injectable, inject } from "inversify";
import type { AuthRepository } from "../../../application/repo/AuthRepository";
import type { User } from "../../../domain/entities/user/User";
import { TYPES } from "@/di/types"; // <-- Import the identifier

@injectable()
export class LoginUseCase {
  constructor(
    @inject(TYPES.AuthRepository) private readonly repo: AuthRepository
  ) {}

  async execute(credentials: {
    email: string;
    password: string;
  }): Promise<{ user: User; accessToken: string }> {
    // Optional: add validation, logging, etc.
    return this.repo.login(credentials);
  }
}
