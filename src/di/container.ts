// src/di/container.ts
import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./types";

import type { IAuthRepository } from "../application/repo/IAuthRepository";
import { AuthRepositoryImpl } from "../data/repo/AuthRepositoryImpl";
import { PlanRepositoryImpl } from "@/data/repo/PlanRepositoryImpl";

import {
  LoginUseCase,
  RegisterUseCase,
  LoadUserUseCase,
  LogoutUseCase,
  ForgotPasswordUseCase,
  ResetPasswordUseCase,
  VerifyEmailUseCase,
} from "../application/use-cases/auth";
import {
  GetPlansUseCase,
  CreatePlanUseCase,
  UpdatePlanUseCase,
  DeletePlanUseCase,
  GetCurrentPlanUseCase,
  GetPlanLimitsUseCase,
  GetAvailablePlansUseCase,
} from "@/application/use-cases/plan";
import type { IProjectRepository } from "@/application/repo/IProjectRepository";
import { ProjectRepositoryImpl } from "@/data/repo/ProjectRepositoryImpl";
import type { IProjectMembershipRepository } from "@/application/repo/IProjectMembershipRepository";
import { ProjectMembershipRepositoryImpl } from "@/data/repo/ProjectMembershipRepositoryImpl";
import type { IChannelRepository } from "@/application/repo/IChannelRepository";
import { ChannelRepositoryImpl } from "@/data/repo/ChannelRepositoryImpl";
import {
  AddMemberUseCase,
  AssignAdminRoleUseCase,
  BlockUserUseCase,
  CreateProjectUseCase,
  GetProjectByIdUseCase,
  GetProjectMembersUseCase,
  ListChannelsUseCase,
  ListUserProjectsUseCase,
  ListUsersUseCase,
} from "@/application/use-cases";
import { CreateChannelUseCase } from "@/application/use-cases/channel/CreateChannelUseCase";
import { UpgradePlanUseCase } from "@/application/use-cases/upgradeplan/UpgradePlanUseCase";
import { CreateRazorpayOrderUseCase } from "@/application/use-cases/upgradeplan/CreateRazorpayOrderUseCase";
import { VerifyPaymentUseCase } from "@/application/use-cases/upgradeplan/VerifyPaymentUseCase";
import type { IRazorpayService } from "@/application/services/IRazorpayService";
import { RazorpayServiceImpl } from "@/data/repo/RazorpayServiceImpl";
import type { IUserSubscriptionRepository } from "@/application/repo/IUserSubscriptionRepository";
import { UserSubscriptionRepositoryImpl } from "@/data/repo/UserSubscriptionRepositoryImpl";
import { EditChannelUseCase } from "@/application/use-cases/channel/EditChannelUseCase";
import { DeleteChannelUseCase } from "@/application/use-cases/channel/DeleteChannelUseCase";
import type { IAdminUsersRepository } from "@/application/repo/IAdminUsersReopsitory";
import { AdminUserRepositoryImpl } from "@/data/repo/AdminUserRepositoryImpl";
import { UpdateProjectUseCase } from "@/application/use-cases/project/UpdateProjectUseCase";

const container = new Container();

// ───── Repository ───────────────────────────────────────
container
  .bind<IAuthRepository>(TYPES.IAuthRepository) // ← generic = interface type
  .to(AuthRepositoryImpl)
  .inSingletonScope();
container.bind(TYPES.IPlanRepository).to(PlanRepositoryImpl).inSingletonScope();
container
  .bind<IProjectRepository>(TYPES.IProjectRepository)
  .to(ProjectRepositoryImpl)
  .inSingletonScope();
container
  .bind<IProjectMembershipRepository>(TYPES.IProjectMembershipRepository)
  .to(ProjectMembershipRepositoryImpl)
  .inSingletonScope();
container
  .bind<IChannelRepository>(TYPES.IChannelRepository)
  .to(ChannelRepositoryImpl)
  .inSingletonScope();
container
  .bind<IUserSubscriptionRepository>(TYPES.IUserSubscriptionRepository)
  .to(UserSubscriptionRepositoryImpl);
container
  .bind<IAdminUsersRepository>(TYPES.IAdminUsersRepository)
  .to(AdminUserRepositoryImpl);

// ───── Use‑cases ────────────────────────────────────────
// Auth use cases
container
  .bind<LoginUseCase>(TYPES.LoginUseCase)
  .to(LoginUseCase)
  .inTransientScope();
container
  .bind<RegisterUseCase>(TYPES.RegisterUseCase)
  .to(RegisterUseCase)
  .inTransientScope();
container
  .bind<LoadUserUseCase>(TYPES.LoadUserUseCase)
  .to(LoadUserUseCase)
  .inTransientScope();
container
  .bind<LogoutUseCase>(TYPES.LogoutUseCase)
  .to(LogoutUseCase)
  .inTransientScope();
container
  .bind<ForgotPasswordUseCase>(TYPES.ForgotPasswordUseCase)
  .to(ForgotPasswordUseCase)
  .inTransientScope();
container
  .bind<ResetPasswordUseCase>(TYPES.ResetPasswordUseCase)
  .to(ResetPasswordUseCase)
  .inTransientScope();
container
  .bind<VerifyEmailUseCase>(TYPES.VerifyEmailUseCase)
  .to(VerifyEmailUseCase)
  .inTransientScope();

// Plan use cases
container
  .bind<GetPlansUseCase>(TYPES.GetPlansUseCase)
  .to(GetPlansUseCase)
  .inTransientScope();
container
  .bind<CreatePlanUseCase>(TYPES.CreatePlanUseCase)
  .to(CreatePlanUseCase)
  .inTransientScope();
container
  .bind<UpdatePlanUseCase>(TYPES.UpdatePlanUseCase)
  .to(UpdatePlanUseCase)
  .inTransientScope();
container
  .bind<DeletePlanUseCase>(TYPES.DeletePlanUseCase)
  .to(DeletePlanUseCase)
  .inTransientScope();
container
  .bind<GetCurrentPlanUseCase>(TYPES.GetCurrentPlanUseCase)
  .to(GetCurrentPlanUseCase)
  .inTransientScope();
container
  .bind<GetPlanLimitsUseCase>(TYPES.GetPlanLimitsUseCase)
  .to(GetPlanLimitsUseCase)
  .inTransientScope();
container
  .bind<GetAvailablePlansUseCase>(TYPES.GetAvailablePlansUseCase)
  .to(GetAvailablePlansUseCase)
  .inTransientScope();
container
  .bind<UpgradePlanUseCase>(TYPES.UpgradePlanUseCase)
  .to(UpgradePlanUseCase);
container
  .bind<CreateRazorpayOrderUseCase>(TYPES.CreateRazorpayOrderUseCase)
  .to(CreateRazorpayOrderUseCase);
container
  .bind<VerifyPaymentUseCase>(TYPES.VerifyPaymentUseCase)
  .to(VerifyPaymentUseCase);

container
  .bind<IRazorpayService>(TYPES.IRazorpayService)
  .to(RazorpayServiceImpl);

// Project use cases
container
  .bind<CreateProjectUseCase>(TYPES.CreateProjectUseCase)
  .to(CreateProjectUseCase)
  .inTransientScope();
container
  .bind<ListUserProjectsUseCase>(TYPES.ListUserProjectsUseCase)
  .to(ListUserProjectsUseCase)
  .inTransientScope();
container
  .bind<GetProjectByIdUseCase>(TYPES.GetProjectByIdUseCase)
  .to(GetProjectByIdUseCase)
  .inTransientScope();
container
  .bind<UpdateProjectUseCase>(TYPES.UpdateProjectUseCase)
  .to(UpdateProjectUseCase)
  .inTransientScope();

// Membership use cases
container
  .bind<AddMemberUseCase>(TYPES.AddMemberUseCase)
  .to(AddMemberUseCase)
  .inTransientScope();
container
  .bind<GetProjectMembersUseCase>(TYPES.GetProjectMembersUseCase)
  .to(GetProjectMembersUseCase)
  .inTransientScope();

// ──────── Channel Use Cases ────────
// Channels
container
  .bind<CreateChannelUseCase>(TYPES.CreateChannelUseCase)
  .to(CreateChannelUseCase)
  .inTransientScope();
container
  .bind<ListChannelsUseCase>(TYPES.ListChannelsUseCase)
  .to(ListChannelsUseCase)
  .inTransientScope();
container
  .bind<EditChannelUseCase>(TYPES.EditChannelUseCase)
  .to(EditChannelUseCase)
  .inTransientScope();

container
  .bind<DeleteChannelUseCase>(TYPES.DeleteChannelUseCase)
  .to(DeleteChannelUseCase)
  .inTransientScope();

container
  .bind<ListUsersUseCase>(TYPES.ListUsersUseCase)
  .to(ListUsersUseCase)
  .inTransientScope();
container
  .bind<BlockUserUseCase>(TYPES.BlockUserUseCase)
  .to(BlockUserUseCase)
  .inTransientScope();
container
  .bind<AssignAdminRoleUseCase>(TYPES.AssignAdminRoleUseCase)
  .to(AssignAdminRoleUseCase)
  .inTransientScope();
export { container, TYPES };
