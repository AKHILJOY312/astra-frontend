import api from "../../lib/apicaller";
import type {
  CreateChannelDTO,
  EditChannelDTO,
} from "@/application/repo/IChannelRepository";
import { API_ROUTES } from "./apiRoutes.constants";

export const createChannel = (projectId: string, payload: CreateChannelDTO) =>
  api.post(API_ROUTES.PROJECTS.CHANNELS(projectId), payload);

export const getChannels = (projectId: string) =>
  api.get(API_ROUTES.PROJECTS.CHANNELS(projectId));

export const editChannel = (
  projectId: string,
  channelId: string,
  payload: EditChannelDTO
) =>
  api.patch(API_ROUTES.PROJECTS.CHANNEL_BY_ID(projectId, channelId), payload);

export const deleteChannel = (projectId: string, channelId: string) =>
  api.delete(API_ROUTES.PROJECTS.CHANNEL_BY_ID(projectId, channelId));
