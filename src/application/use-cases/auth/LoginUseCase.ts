// src/domain/useCases/auth/LoginUseCase.ts
import { injectable, inject } from "inversify";
import type { IAuthRepository } from "../../repo/IAuthRepository";
import type { User } from "../../../domain/entities/user/User";
import { TYPES } from "@/di/types"; // <-- Import the identifier

@injectable()
export class LoginUseCase {
  constructor(
    @inject(TYPES.IAuthRepository) private readonly repo: IAuthRepository
  ) {}

  async execute(credentials: {
    email: string;
    password: string;
    isAdminLogin?: boolean;
  }): Promise<{ user: User; accessToken: string }> {
    // Optional: add validation, logging, etc.
    return this.repo.login(credentials);
  }
}
