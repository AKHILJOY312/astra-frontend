import type {
  CreateTaskRequest,
  EditTaskRequest,
  SearchMembersRequest,
  SearchMembersResponse,
  TaskAttachmentUploadRequest,
  TaskAttachmentUploadResponse,
  TaskStatus,
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

export const listTasks = (
  projectId: string,
  params: {
    status: TaskStatus;
    limit?: number;
    cursor?: string | null;
  },
) => {
  return api.get(API_ROUTES.TASKS.ROOT(projectId), { params });
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

//post api/tasks/:taskId/command
export const addCommentToTaskApi = async (
  projectId: string,
  taskId: string,
  message: string,
) => {
  return await api.post(API_ROUTES.TASKS.COMMENT(projectId, taskId), {
    message,
  });
};

export const getAllTaskForUser = async () =>
  api.get(API_ROUTES.TASKS.GET_ALL_TASKS);
