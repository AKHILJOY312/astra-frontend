// // src/presentation/redux/thunk/adminAuthThunks.ts
// import { createAsyncThunk } from "@reduxjs/toolkit";
// import adminApi from "@/lib/adminApi";

// export const adminLogin = createAsyncThunk(
//   "adminAuth/login",
//   async (
//     credentials: { email: string; password: string },
//     { rejectWithValue }
//   ) => {
//     try {
//       const res = await adminApi.post("/admin/auth/login", credentials);
//       localStorage.setItem("adminToken", res.data.accessToken);
//       return res.data.user;
//     } catch (err: any) {
//       return rejectWithValue(err.response?.data?.message || "Login failed");
//     }
//   }
// );
