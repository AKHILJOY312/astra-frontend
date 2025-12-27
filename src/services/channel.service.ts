import type { CreateChannel, EditChannel } from "@/types";
import api from "./api";
import { API_ROUTES } from "./apiRoutes.constants";

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
