import api from "../../lib/apicaller";
import type { EditChannelDTO } from "@/application/repo/IChannelRepository";

export const createChannel = (projectId: string, payload: any) =>
  api.post(`/projects/${projectId}/channels`, payload);

export const getChannels = (projectId: string) =>
  api.get(`/projects/${projectId}/channels`);

export const editChannel = (
  projectId: string,
  channelId: string,
  payload: EditChannelDTO
) => api.patch(`/projects/${projectId}/channels/${channelId}`, payload);

export const deleteChannel = (projectId: string, channelId: string) =>
  api.delete(`/projects/${projectId}/channels/${channelId}`);
