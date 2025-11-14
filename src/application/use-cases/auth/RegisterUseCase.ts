// src/domain/useCases/auth/RegisterUseCase.ts
import { injectable, inject } from "inversify";
import type { AuthRepository } from "../../repo/AuthRepository";
import { TYPES } from "@/di/types"; // <-- Import the identifier

@injectable()
export class RegisterUseCase {
  constructor(
    @inject(TYPES.AuthRepository) private readonly repo: AuthRepository
  ) {}

  async execute(data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): Promise<{ message: string }> {
    return this.repo.register(data);
  }
}
