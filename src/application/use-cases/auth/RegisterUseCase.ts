// src/domain/useCases/auth/RegisterUseCase.ts
import { injectable, inject } from "inversify";
import type { IAuthRepository } from "../../repo/IAuthRepository";
import { TYPES } from "@/di/types"; // <-- Import the identifier

@injectable()
export class RegisterUseCase {
  constructor(
    @inject(TYPES.IAuthRepository) private readonly repo: IAuthRepository
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
