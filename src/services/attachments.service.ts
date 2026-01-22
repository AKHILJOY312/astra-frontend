import type { DispositionType } from "@/types";
import api from "./api";
import { API_ROUTES } from "./apiRoutes.constants";

export const getAttachmentAccessUrl = async (
  attachmentId: string,
  disposition: DispositionType,
) => {
  const res = await api.get(API_ROUTES.ATTACHMENT.GET_URL(attachmentId), {
    params: { disposition },
  });

  return res.data.data.url;
};
