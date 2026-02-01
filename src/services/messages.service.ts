import api from "@/services/api";
import { API_ROUTES } from "./apiRoutes.constants";

export const fetchMessages = (
  projectId: string,
  channelId: string,
  limit = 20,
) => {
  return api.get(API_ROUTES.MESSAGE.LIST(projectId, channelId), {
    params: { limit },
  });
};

export const fetchOlderMessages = (
  projectId: string,
  channelId: string,
  cursor: string,
  limit = 20,
) => {
  return api.get(API_ROUTES.MESSAGE.LIST(projectId, channelId), {
    params: { cursor, limit },
  });
};

export const fetchReplies = (
  projectId: string,
  channelId: string,
  messageId: string,
  limit = 20,
) => {
  return api.get(
    `/projects/${projectId}/channels/${channelId}/messages/${messageId}/reply`,
    { params: { limit } },
  );
};

//export const fetchOlderReply=()
