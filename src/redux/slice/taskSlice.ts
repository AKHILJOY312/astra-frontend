import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TaskComment, Task, TaskState, TaskStatus } from "@/types";

const createColumn = (): {
  tasks: Task[];
  cursor: string | null;
  hasMore: boolean;
  loading: boolean;
} => ({
  tasks: [],
  cursor: null,
  hasMore: true,
  loading: false,
});

const initialState: TaskState = {
  columns: {
    todo: createColumn(),
    inprogress: createColumn(),
    done: createColumn(),
  },
  activeTask: null,
  activeTaskId: null,
  error: null,
  isManager: false,
};
type ColumnPayload<T = unknown> = {
  status: TaskStatus;
  data: T;
};
const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    // ---------------------------
    // Loading & Error
    // ---------------------------
    setColumnLoading(state, action: PayloadAction<ColumnPayload<boolean>>) {
      state.columns[action.payload.status].loading = action.payload.data;
    },

    setTaskError(state, action: PayloadAction<string>) {
      //   state.loading = false;
      state.error = action.payload;
    },
    clearTaskError(state) {
      state.error = null;
    },

    // ---------------------------
    // CRUD Reducers
    // ---------------------------

    setInitialTasks(
      state,
      action: PayloadAction<
        ColumnPayload<{
          tasks: Task[];
          cursor: string | null;
          hasMore: boolean;
          isManager: boolean;
        }>
      >,
    ) {
      const column = state.columns[action.payload.status];

      column.tasks = action.payload.data.tasks;
      column.cursor = action.payload.data.cursor;
      column.hasMore = action.payload.data.hasMore;
      column.loading = false;

      state.isManager = action.payload.data.isManager;
    },
    appendTasks(
      state,
      action: PayloadAction<
        ColumnPayload<{
          tasks: Task[];
          cursor: string | null;
          hasMore: boolean;
        }>
      >,
    ) {
      const column = state.columns[action.payload.status];

      // Create a Set of existing IDs for O(1) lookup
      const existingIds = new Set(column.tasks.map((t) => t.id));

      // Only append tasks that aren't already in the state
      const newTasks = action.payload.data.tasks.filter(
        (task) => !existingIds.has(task.id),
      );

      column.tasks.push(...newTasks);
      column.cursor = action.payload.data.cursor;
      column.hasMore = action.payload.data.hasMore;
      column.loading = false;
    },

    addTask(state, action: PayloadAction<Task>) {
      state.columns[action.payload.status].tasks.unshift(action.payload);
    },

    updateTask(state, action: PayloadAction<Task>) {
      const column = state.columns[action.payload.status];
      const idx = column.tasks.findIndex((t) => t.id === action.payload.id);

      if (idx !== -1) column.tasks[idx] = action.payload;

      if (state.activeTaskId === action.payload.id) {
        state.activeTask = action.payload;
      }
    },

    removeTask(state, action: PayloadAction<Task>) {
      state.columns[action.payload.status].tasks = state.columns[
        action.payload.status
      ].tasks.filter((t) => t.id !== action.payload.id);
    },

    // ---------------------------
    // Status Update (Kanban Drag)
    // ---------------------------

    moveTask(
      state,
      action: PayloadAction<{
        task: Task;
        from: TaskStatus;
        to: TaskStatus;
      }>,
    ) {
      state.columns[action.payload.from].tasks = state.columns[
        action.payload.from
      ].tasks.filter((t) => t.id !== action.payload.task.id);

      state.columns[action.payload.to].tasks.unshift({
        ...action.payload.task,
        status: action.payload.to,
      });
    },

    // Inside your taskSlice reducers:
    addCommentToTask(
      state,
      action: PayloadAction<{
        taskId: string;
        status: TaskStatus;
        comment: TaskComment;
      }>,
    ) {
      const { taskId, status, comment } = action.payload;
      const column = state.columns[status];
      const task = column.tasks.find((t) => t.id === taskId);

      if (task) {
        // Add to the task in the list
        if (!task.comments) task.comments = [];
        task.comments.push(comment);

        // Sync with activeTask if it's the one currently open
        if (state.activeTask && state.activeTask.id === taskId) {
          state.activeTask.comments.push(comment);
        }
      }
    },
    // ---------------------------
    // Active Task
    // ---------------------------
    setActiveTask(state, action: PayloadAction<Task | null>) {
      state.activeTaskId = action.payload?.id ?? null;
      state.activeTask = action.payload;
    },
  },
});

export const {
  setColumnLoading,
  setTaskError,
  clearTaskError,
  setInitialTasks,
  appendTasks,
  addTask,
  updateTask,
  removeTask,
  moveTask,
  setActiveTask,
  addCommentToTask,
} = taskSlice.actions;

export default taskSlice.reducer;
