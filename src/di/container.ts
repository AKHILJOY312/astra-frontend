// src/di/container.ts
import "reflect-metadata";
import { Container } from "inversify";

import { TYPES } from "./types";
import type { AuthRepository } from "../application/repo/AuthRepository";
import { AuthRepositoryImpl } from "../data/repo/AuthRepositoryImpl";

import {
  LoginUseCase,
  RegisterUseCase,
  LoadUserUseCase,
  LogoutUseCase,
  ForgotPasswordUseCase,
  ResetPasswordUseCase,
  VerifyEmailUseCase,
} from "../application/use-cases/auth";

import { PlanRepositoryImpl } from "@/data/repo/PlanRepositoryImpl";
import {
  GetPlansUseCase,
  CreatePlanUseCase,
  UpdatePlanUseCase,
  DeletePlanUseCase,
} from "@/application/use-cases/plan";
const container = new Container();

// ───── Repository ───────────────────────────────────────
container
  .bind<AuthRepository>(TYPES.AuthRepository) // ← generic = interface type
  .to(AuthRepositoryImpl)
  .inSingletonScope();

container.bind(TYPES.PlanRepository).to(PlanRepositoryImpl).inSingletonScope();

// ───── Use‑cases ────────────────────────────────────────
container.bind(LoginUseCase).toSelf().inTransientScope();
container.bind(RegisterUseCase).toSelf().inTransientScope();
container.bind(LoadUserUseCase).toSelf().inTransientScope();
container.bind(LogoutUseCase).toSelf().inTransientScope();
container.bind(ForgotPasswordUseCase).toSelf().inTransientScope();
container.bind(ResetPasswordUseCase).toSelf().inTransientScope();
container.bind(VerifyEmailUseCase).toSelf().inTransientScope();

container.bind(GetPlansUseCase).toSelf().inTransientScope();
container.bind(CreatePlanUseCase).toSelf().inTransientScope();
container.bind(UpdatePlanUseCase).toSelf().inTransientScope();
container.bind(DeletePlanUseCase).toSelf().inTransientScope();
export { container, TYPES };
