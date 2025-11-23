// // src/lib/adminApi.ts
// import axios from "axios";
// import { tokenService } from "./tokenService"; // same service, but we'll use admin key

// const ADMIN_TOKEN_KEY = "adminToken"; // different key!

// const adminApi = axios.create({
//   baseURL: "/api",
//   withCredentials: true,
//   validateStatus: (status) => status >= 200 && status < 300,
// });

// // Admin-specific public routes (no token needed)
// const adminExcludedUrls = [
//   "/admin/auth/login",
//   "/admin/auth/forgot-password",
//   "/admin/auth/reset-password",
// ];

// // Add admin token to requests
// adminApi.interceptors.request.use((config) => {
//   const token = localStorage.getItem(ADMIN_TOKEN_KEY);
//   if (token) {
//     config.headers["Authorization"] = `Bearer ${token}`;
//   }
//   return config;
// });

// // Token refresh queue (same smart logic as user)
// let isRefreshing = false;
// let failedQueue: Array<{
//   resolve: (value: any) => void;
//   reject: (reason?: any) => void;
// }> = [];

// const processQueue = (error: any, token: string | null = null) => {
//   failedQueue.forEach((prom) => {
//     error ? prom.reject(error) : prom.resolve(token);
//   });
//   failedQueue = [];
// };

// adminApi.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // Skip refresh logic for public admin routes
//     if (adminExcludedUrls.some((url) => originalRequest.url.includes(url))) {
//       return Promise.reject(error);
//     }

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//           .then((token) => {
//             originalRequest.headers["Authorization"] = `Bearer ${token}`;
//             return adminApi(originalRequest);
//           })
//           .catch((err) => Promise.reject(err));
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         // Your backend should have /admin/auth/refresh-token
//         const { data } = await adminApi.post(
//           "/admin/auth/refresh-token",
//           {},
//           { withCredentials: true }
//         );
//         const newToken = data.accessToken;

//         localStorage.setItem(ADMIN_TOKEN_KEY, newToken);
//         originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
//         processQueue(null, newToken);

//         return adminApi(originalRequest);
//       } catch (refreshError: any) {
//         processQueue(refreshError, null);
//         localStorage.removeItem(ADMIN_TOKEN_KEY);
//         window.location.href = "/admin/login"; // redirect to admin login
//         return Promise.reject(refreshError);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default adminApi;
