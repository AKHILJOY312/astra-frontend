//---------------------------------------------------
//Tasks
//---------------------------------------------------

import type { User } from "./auth.types";

export type TaskStatus = "todo" | "inprogress" | "done";

export type TaskPriority = "low" | "medium" | "high";

export interface TaskAttachment {
  id: string;
  fileName: string;
  fileKey: string;
  fileType: string;
  fileUrl: string;
  fileSize: number;
  size: number;
  uploadedAt: string;
  uploadedBy: User;
}
export type assignedUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
};
export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;

  assignedTo: assignedUser | null;
  createdBy: User;

  attachments: TaskAttachment[];
  comments: TaskComment[];
  isDeleted: boolean;
}
export interface TaskComment {
  author: User;
  message: string;
  createdAt: string;
}

export interface AssignableMember {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate?: string;
  assignedTo: string;
  attachments?: {
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
  }[];
}
export interface EditTaskRequest {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string;
  assignedTo?: string;
}
export interface UpdateTaskStatusRequest {
  status: TaskStatus;
}

export interface ListTasksQuery {
  projectId: string;
  status?: TaskStatus;
  assignedToMe?: boolean;
}

export interface TaskResponse {
  task: Task;
}

export interface TaskListResponse {
  tasks: Task[];
}

/* ---------- MEMBERS ---------- */

export interface SearchMembersRequest {
  projectId: string;
  query: string;
}

export interface SearchMembersResponse {
  members: AssignableMember[];
}

/* ---------- ATTACHMENTS ---------- */

export interface TaskAttachmentUploadRequest {
  taskId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
}

export interface TaskAttachmentUploadResponse {
  uploadUrl: string;
  fileKey: string;
  expiresAt?: string;
}

// export type TaskState = {
//   tasks: Task[];
//   loading: boolean;
//   activeTaskId: string | null;
//   activeTask: Task | null;
//   error: string | null;
//   cursor: string | null;
//   hasMore: boolean;
//   isManager: boolean;
// };
export type ColumnState = {
  tasks: Task[];
  cursor: string | null;
  hasMore: boolean;
  loading: boolean;
};

export type TaskState = {
  columns: Record<TaskStatus, ColumnState>;
  activeTask: Task | null;
  activeTaskId: string | null;
  error: string | null;
  isManager: boolean;
};

export type DispositionType = "view" | "download" | "task";
