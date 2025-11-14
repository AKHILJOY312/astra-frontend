// src/schemas/loginSchema.ts
import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(1, "Password is required")
    .required("Password is required"),
  server: yup.string().optional(),
});
