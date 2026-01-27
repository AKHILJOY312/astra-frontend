import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store/store";
import {
  addTask,
  updateTask,
  removeTask,
  setTaskError,
  clearTaskError,
  setActiveTask,
  appendTasks,
  setColumnLoading,
  setInitialTasks,
  moveTask,
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
  TaskStatus,
} from "@/types";
import axios from "axios";
const PAGE_SIZE = 4;

export const useTasks = (projectId: string) => {
  const dispatch = useDispatch<AppDispatch>();

  const { columns, error, activeTask, activeTaskId, isManager } = useSelector(
    (state: RootState) => state.task,
  );

  // ---------------------------
  // Load Tasks
  // ---------------------------

  const loadInitialTask = useCallback(
    async (status: TaskStatus) => {
      dispatch(setColumnLoading({ status, data: true }));

      try {
        const res = await listTasks(projectId, {
          status,
          limit: PAGE_SIZE,
          cursor: null,
        });
        dispatch(
          setInitialTasks({
            status,
            data: {
              tasks: res.data.data.tasks,
              cursor: res.data.data.pageInfo.nextCursor,
              hasMore: res.data.data.pageInfo.hasMore,
              isManager: res.data.data.isManager,
            },
          }),
        );
      } catch (err) {
        console.error(err);
        dispatch(setTaskError("Failed To load tasks"));
      }
    },
    [dispatch, projectId],
  );

  const loadMoreTasks = useCallback(
    async (status: TaskStatus) => {
      const column = columns[status];
      if (column.loading || !column.hasMore) return;

      dispatch(setColumnLoading({ status, data: true }));

      const res = await listTasks(projectId, {
        status,
        cursor: column.cursor,
        limit: PAGE_SIZE,
      });

      dispatch(
        appendTasks({
          status,
          data: {
            tasks: res.data.data.tasks,
            cursor: res.data.data.nextCursor,
            hasMore: res.data.data.hasMore,
          },
        }),
      );
    },
    [columns, dispatch, projectId],
  );

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
    task: Task,
    payload: UpdateTaskStatusRequest,
  ) => {
    dispatch(
      moveTask({
        task,
        from: task.status,
        to: payload.status,
      }),
    );

    try {
      await updateTaskStatus(task.id, payload);
    } catch (err) {
      console.error(err);
      dispatch(setTaskError("Failed to update task status"));
      throw err;
    }
  };

  // ---------------------------
  // Delete Task
  // ---------------------------
  const deleteTaskAsync = async (task: Task) => {
    try {
      await deleteTaskApi(task.id);
      dispatch(removeTask(task));
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
    columns,
    error,
    activeTask,
    activeTaskId,
    isManager,

    loadInitialTask,
    loadMoreTasks,
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
