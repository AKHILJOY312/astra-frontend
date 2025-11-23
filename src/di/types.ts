// src/di/types.ts
export const TYPES = {
  AuthRepository: Symbol.for("AuthRepository"),
  PlanRepository: Symbol.for("PlanRepository"),
  // add more identifiers here later
} as const;
