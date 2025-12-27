// src/schemas/authSchemas.ts
import * as Yup from "yup";

// -----------------------------
// LOGIN SCHEMA
// -----------------------------

export const loginSchema = Yup.object({
  email: Yup.string()
    .trim()
    .strict(true)
    .required("Email is required")
    .max(254, "Email is too long")
    .matches(
      /^[a-zA-Z0-9]+([._%+-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address"
    ),

  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long")
    .matches(/^(?!\s).*$/, "Password cannot start with whitespace"),
});

// -----------------------------
// REGISTER SCHEMA
// -----------------------------
export const registerSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),

  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm password is required"),
});

// -----------------------------
// FORGOT PASSWORD SCHEMA
// -----------------------------
export const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),
});

// -----------------------------
// RESET PASSWORD SCHEMA
// -----------------------------
export const resetPasswordSchema = Yup.object({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm password is required"),
});

// -----------------------------
// UPDATE PROFILE SCHEMA
// -----------------------------
export const updateProfileSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),

  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),
});

// -----------------------------
// CHANGE PASSWORD (Inside Profile)
// -----------------------------
export const changePasswordSchema = Yup.object({
  oldPassword: Yup.string().required("Old password is required"),

  newPassword: Yup.string()
    .min(8, "New password must be at least 8 characters")
    .required("New password is required"),

  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords do not match")
    .required("Confirm password is required"),
});
