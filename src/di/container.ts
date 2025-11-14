// src/di/container.ts
import "reflect-metadata";
import { Container } from "inversify";

import { TYPES } from "./types"; // ← identifier
import type { AuthRepository } from "../application/repo/AuthRepository"; // ← INTERFACE TYPE
import { AuthRepositoryImpl } from "../data/repo/AuthRepositoryImpl";

import {
  LoginUseCase,
  RegisterUseCase,
  LoadUserUseCase,
  LogoutUseCase,
  ForgotPasswordUseCase,
  ResetPasswordUseCase,
  VerifyEmailUseCase, // ← ADD THIS
} from "../application/use-cases/auth";

const container = new Container();

// ───── Repository ───────────────────────────────────────
container
  .bind<AuthRepository>(TYPES.AuthRepository) // ← generic = interface type
  .to(AuthRepositoryImpl)
  .inSingletonScope();

// ───── Use‑cases ────────────────────────────────────────
container.bind(LoginUseCase).toSelf().inTransientScope();
container.bind(RegisterUseCase).toSelf().inTransientScope();
container.bind(LoadUserUseCase).toSelf().inTransientScope();
container.bind(LogoutUseCase).toSelf().inTransientScope();
container.bind(ForgotPasswordUseCase).toSelf().inTransientScope();
container.bind(ResetPasswordUseCase).toSelf().inTransientScope();
container.bind(VerifyEmailUseCase).toSelf().inTransientScope(); // ← ADD THIS

export { container, TYPES };
