import type { CreateChannel, EditChannel } from "@/types";
import api from "./api";
import { API_ROUTES } from "./apiRoutes.constants";

// Type for request body
interface UploadUrlRequest {
  fileName: string;
  fileSize: number;
  mimeType: string;
}

// Type for successful response (adjust according to your backend)
export interface PresignedUploadResponse {
  uploadUrl: string;
  key: string;
  permanentUrl: string;
  expiresAt?: string;
}

export const UserCreateChannel = (projectId: string, payload: CreateChannel) =>
  api.post(API_ROUTES.PROJECTS.CHANNELS(projectId), payload);

export const getChannels = (projectId: string) =>
  api.get(API_ROUTES.PROJECTS.CHANNELS(projectId));

export const UserEditChannel = (
  projectId: string,
  channelId: string,
  payload: EditChannel
) =>
  api.patch(API_ROUTES.PROJECTS.CHANNEL_BY_ID(projectId, channelId), payload);

export const UserDeleteChannel = (projectId: string, channelId: string) =>
  api.delete(API_ROUTES.PROJECTS.CHANNEL_BY_ID(projectId, channelId));

export const requestChatFileUploadUrl = async (
  projectId: string,
  channelId: string,
  payload: UploadUrlRequest
): Promise<PresignedUploadResponse> => {
  const response = await api.post(
    API_ROUTES.PROJECTS.UPLOAD_URL(projectId, channelId),
    payload
  );
  return response.data.data; // Adjust path if your response structure is different
};
