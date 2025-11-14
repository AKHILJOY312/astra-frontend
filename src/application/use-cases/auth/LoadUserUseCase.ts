// src/domain/useCases/auth/LoadUserUseCase.ts
import { injectable, inject } from "inversify";
import type { AuthRepository } from "../../repo/AuthRepository";
import type { User } from "../../../domain/entities/user/User";
import { TYPES } from "@/di/types"; // <-- Import the identifier

@injectable()
export class LoadUserUseCase {
  constructor(
    @inject(TYPES.AuthRepository) private readonly repo: AuthRepository
  ) {}

  async execute(): Promise<User> {
    return this.repo.loadUser();
  }
}
