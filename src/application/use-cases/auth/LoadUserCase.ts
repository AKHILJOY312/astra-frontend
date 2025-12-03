// src/domain/useCases/auth/LoadUserUseCase.ts
import { injectable, inject } from "inversify";
import type { IAuthRepository } from "../../repo/IAuthRepository";
import type { User } from "../../../domain/entities/user/User";
import { TYPES } from "@/di/types"; // <-- Import the identifier

@injectable()
export class LoadUserUseCase {
  constructor(
    @inject(TYPES.IAuthRepository) private readonly repo: IAuthRepository
  ) {}

  async execute(): Promise<User> {
    return this.repo.loadUser();
  }
}
