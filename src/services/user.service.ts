import api from "./api";
import { API_ROUTES } from "./apiRoutes.constants";

export const getMyProfile = () => api.get(API_ROUTES.USERS.ME);

export const updateProfile = (payload: { name: string; email: string }) =>
  api.patch(API_ROUTES.USERS.ME, payload);

export const deleteAccount = () => api.delete(API_ROUTES.USERS.ME);

export const getUploadUrl = (fileType: string) =>
  api.post(API_ROUTES.USERS.PROFILE_IMAGE_UPLOAD, { fileType });

export const saveProfileImage = (imageUrl: string) =>
  api.patch(API_ROUTES.USERS.PROFILE_IMAGE_SAVE, { imageUrl });
