//src/services/meeting.services.ts

import api from "./api";
import { API_ROUTES } from "./apiRoutes.constants";

export interface LeaveMeeting {
  meetingId: string;
  socketId: string;
}

export const userCreateMeeting = (maxParticipants?: number) =>
  api.post(API_ROUTES.VIDEO_CALL.ROOT, maxParticipants);

export const validateAndJoinMeeting = (code: string) =>
  api.get(API_ROUTES.VIDEO_CALL.CODE(code));

export const leaveMeeting = (payload: LeaveMeeting) =>
  api.post(API_ROUTES.VIDEO_CALL.END, payload);

export const getMeetingToken = (code: string) =>
  api.get(`${API_ROUTES.VIDEO_CALL.ROOT}/${code}/token`);
