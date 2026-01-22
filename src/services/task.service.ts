import type {
  CreateTaskRequest,
  EditTaskRequest,
  SearchMembersRequest,
  SearchMembersResponse,
  TaskAttachmentUploadRequest,
  TaskAttachmentUploadResponse,
  UpdateTaskStatusRequest,
} from "@/types";
import api from "./api";
import { API_ROUTES } from "./apiRoutes.constants";

export const UserCreateTask = (
  projectId: string,
  payload: CreateTaskRequest,
) => {
  return api.post(API_ROUTES.TASKS.ROOT(projectId), payload);
};
export const listTasks = (projectId: string) => {
  return api.get(API_ROUTES.TASKS.ROOT(projectId));
};

export const UserEditTask = (taskId: string, payload: EditTaskRequest) => {
  return api.patch(API_ROUTES.TASKS.BY_ID(taskId), payload);
};
export const updateTaskStatus = (
  taskId: string,
  payload: UpdateTaskStatusRequest,
) => {
  return api.patch(API_ROUTES.TASKS.STATUS(taskId), payload);
};
export const deleteTask = (taskId: string) => {
  return api.delete(API_ROUTES.TASKS.BY_ID(taskId));
};
export const searchProjectMembers = async (
  payload: SearchMembersRequest,
): Promise<SearchMembersResponse> => {
  const response = await api.get(
    API_ROUTES.TASKS.MEMBERS_SEARCH(payload.projectId),
    {
      params: { query: payload.query },
    },
  );

  return response.data.data;
};

export const requestTaskAttachmentUploadUrl = async (
  projectId: string,
  payload: TaskAttachmentUploadRequest,
): Promise<TaskAttachmentUploadResponse> => {
  const response = await api.post(
    API_ROUTES.TASKS.ATTACHMENT_UPLOAD(projectId),
    payload,
  );

  return response.data.data;
};
