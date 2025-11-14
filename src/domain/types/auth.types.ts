// src/domain/types/auth.types.ts
export type VerifyEmailResponse = {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    name?: string;
    emailVerified: boolean;
  };
};
