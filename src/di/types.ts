// src/di/types.ts
export const TYPES = {
  IAuthRepository: Symbol.for("IAuthRepository"),
  IPlanRepository: Symbol.for("IPlanRepository"),
  IProjectRepository: Symbol.for("IProjectRepository"),
  IProjectMembershipRepository: Symbol.for("IProjectMembershipRepository"),
  IChannelRepository: Symbol.for("IChannelRepository"),
  IUserSubscriptionRepository: Symbol.for("IUserSubscriptionRepository"),
  IRazorpayService: Symbol.for("IRazorpayService"),
  IAdminUsersRepository: Symbol.for("IAdminUsersRepository"),
  // Auth use cases
  LoginUseCase: Symbol.for("LoginUseCase"),
  RegisterUseCase: Symbol.for("RegisterUseCase"),
  LoadUserUseCase: Symbol.for("LoadUserUseCase"),
  LogoutUseCase: Symbol.for("LogoutUseCase"),
  ForgotPasswordUseCase: Symbol.for("ForgotPasswordUseCase"),
  ResetPasswordUseCase: Symbol.for("ResetPasswordUseCase"),
  VerifyEmailUseCase: Symbol.for("VerifyEmailUseCase"),

  // Project
  CreateProjectUseCase: Symbol.for("CreateProjectUseCase"),
  ListUserProjectsUseCase: Symbol.for("ListUserProjectsUseCase"),
  GetProjectByIdUseCase: Symbol.for("GetProjectByIdUseCase"),
  UpdateProjectUseCase: Symbol.for("UpdateProjectUseCase"),
  // Members
  AddMemberUseCase: Symbol.for("AddMemberUseCase"),
  GetProjectMembersUseCase: Symbol.for("GetProjectMembersUseCase"),

  // Plan
  GetCurrentPlanUseCase: Symbol.for("GetCurrentPlanUseCase"),
  GetPlansUseCase: Symbol.for("GetPlansUseCase"),
  CreatePlanUseCase: Symbol.for("CreatePlanUseCase"),
  UpdatePlanUseCase: Symbol.for("UpdatePlanUseCase"),
  DeletePlanUseCase: Symbol.for("DeletePlanUseCase"),
  GetPlanLimitsUseCase: Symbol.for("GetPlanLimitsUseCase"),
  UpgradePlanUseCase: Symbol.for("UpgradePlanUseCase"),
  GetAvailablePlansUseCase: Symbol.for("GetAvailablePlansUseCase"),

  // Channels
  CreateChannelUseCase: Symbol.for("CreateChannelUseCase"),
  ListChannelsUseCase: Symbol.for("ListChannelsUseCase"),
  EditChannelUseCase: Symbol.for("EditChannelUseCase"),
  DeleteChannelUseCase: Symbol.for("DeleteChannelUseCase"),

  CreateRazorpayOrderUseCase: Symbol.for("CreateRazorpayOrderUseCase"),
  VerifyPaymentUseCase: Symbol.for("VerifyPaymentUseCase"),

  ListUsersUseCase: Symbol.for("ListUsersUseCase"),
  BlockUserUseCase: Symbol.for("BlockUserUseCase"),
  AssignAdminRoleUseCase: Symbol.for("AssignAdminRole"),
} as const;
