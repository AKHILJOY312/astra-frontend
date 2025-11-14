// src/presentation/redux/thunks/authThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { container } from "../../../di/container";
import {
  LoginUseCase,
  RegisterUseCase,
  LoadUserUseCase,
  LogoutUseCase,
  ForgotPasswordUseCase,
  ResetPasswordUseCase,
  VerifyEmailUseCase,
} from "../../../application/use-cases/auth/index";

// Resolve once (singleton)
const loginUC = container.get(LoginUseCase);
const registerUC = container.get(RegisterUseCase);
const loadUserUC = container.get(LoadUserUseCase);
const logoutUC = container.get(LogoutUseCase);
const forgotUC = container.get(ForgotPasswordUseCase);
const resetUC = container.get(ResetPasswordUseCase);
const verifyUC = container.get(VerifyEmailUseCase);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      return await loginUC.execute(credentials);
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Login failed");
    }
  }
);

// repeat for the other 5 actions – just change the UC and payload shape
export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      return await loadUserUC.execute();
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Not authenticated");
    }
  }
);

// 1. Register
export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    data: {
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
    },
    { rejectWithValue }
  ) => {
    try {
      return await registerUC.execute(data);
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || "Registration failed"
      );
    }
  }
);

// 2. Logout
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutUC.execute();
    } catch (e: any) {
      // Even if API fails we want local logout
      return rejectWithValue(e.response?.data?.message || "Logout failed");
    }
  }
);

// 3. Forgot Password
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      return await forgotUC.execute(email);
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Error occurred");
    }
  }
);

// 4. Reset Password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (
    { token, password }: { token: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      return await resetUC.execute(token, password);
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || "Failed to reset password"
      );
    }
  }
);

// 5. Verify Email
export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (token: string, { rejectWithValue }) => {
    try {
      return await verifyUC.execute(token);
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || "Verification failed"
      );
    }
  }
);
