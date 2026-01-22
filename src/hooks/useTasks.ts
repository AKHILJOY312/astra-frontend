import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store/store";
import {
  setTasks,
  addTask,
  updateTask,
  removeTask,
  setTaskLoading,
  setTaskError,
  clearTaskError,
  updateTaskStatusLocally,
  setActiveTask,
} from "@/redux/slice/taskSlice";
import {
  UserCreateTask,
  listTasks,
  updateTaskStatus,
  deleteTask as deleteTaskApi,
  searchProjectMembers,
  // requestTaskAttachmentUploadUrl,
  UserEditTask,
} from "@/services/task.service";
import type {
  CreateTaskRequest,
  UpdateTaskStatusRequest,
  SearchMembersRequest,
  EditTaskRequest,
  Task,
} from "@/types";
import axios from "axios";

export const useTasks = (projectId: string) => {
  const dispatch = useDispatch<AppDispatch>();

  const { tasks, loading, error, activeTask, activeTaskId, isManager } =
    useSelector((state: RootState) => state.task);

  // ---------------------------
  // Load Tasks
  // ---------------------------
  const loadTasks = useCallback(async () => {
    dispatch(setTaskLoading());

    try {
      const response = await listTasks(projectId);
      dispatch(setTasks(response.data.data));
    } catch (err) {
      console.error(err);
      dispatch(setTaskError("Failed to load tasks"));
    }
  }, [dispatch, projectId]);

  // ---------------------------
  // Create Task
  // ---------------------------
  const createTask = async (payload: CreateTaskRequest) => {
    dispatch(clearTaskError());

    try {
      const response = await UserCreateTask(projectId, payload);
      dispatch(addTask(response.data.data));
      return response.data.data;
    } catch (err) {
      let message = "Failed to create task";

      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || message;
      }

      dispatch(setTaskError(message));
      throw err;
    }
  };

  // ---------------------------
  // Update Task (Full Update)
  // ---------------------------
  const updateTaskAsync = async (taskId: string, payload: EditTaskRequest) => {
    dispatch(clearTaskError());
    try {
      // 1. Call the API
      const response = await UserEditTask(taskId, payload);

      // 2. Update Redux state with the returned data
      const updatedTask = response.data.data;
      dispatch(updateTask(updatedTask));

      return updatedTask;
    } catch (err) {
      console.error(err);
      dispatch(setTaskError("Failed to update task"));
      throw err;
    }
  };

  // ---------------------------
  // Update Task Status (Kanban)
  // ---------------------------
  const changeTaskStatus = async (
    taskId: string,
    payload: UpdateTaskStatusRequest,
  ) => {
    // Optimistic update
    dispatch(
      updateTaskStatusLocally({
        taskId,
        status: payload.status,
      }),
    );

    try {
      await updateTaskStatus(taskId, payload);
    } catch (err) {
      console.error(err);
      dispatch(setTaskError("Failed to update task status"));
      throw err;
    }
  };

  // ---------------------------
  // Delete Task
  // ---------------------------
  const deleteTaskAsync = async (taskId: string) => {
    try {
      await deleteTaskApi(taskId);
      dispatch(removeTask(taskId));
    } catch (err) {
      console.error(err);
      dispatch(setTaskError("Failed to delete task"));
      throw err;
    }
  };

  // ---------------------------
  // Active Task
  // ---------------------------
  const openTask = (task: Task) => {
    dispatch(setActiveTask(task));
  };

  const closeTask = () => {
    dispatch(setActiveTask(null));
  };

  // ---------------------------
  // Members Search (Assign)
  // ---------------------------
  const searchMembers = useCallback(async (payload: SearchMembersRequest) => {
    return await searchProjectMembers(payload);
  }, []);

  // ---------------------------
  // Attachments
  // ---------------------------

  // const getAttachmentUploadUrl = async (payload: any) => {
  //   return await requestTaskAttachmentUploadUrl(projectId, payload);
  // };

  return {
    tasks,
    loading,
    error,
    activeTask,
    activeTaskId,
    isManager,

    loadTasks,
    createTask,
    updateTask: updateTaskAsync,
    changeTaskStatus,
    deleteTask: deleteTaskAsync,

    openTask,
    closeTask,
    searchMembers,
    // getAttachmentUploadUrl,
    clearError: () => dispatch(clearTaskError()),
  };
};
