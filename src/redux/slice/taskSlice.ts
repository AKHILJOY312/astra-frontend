import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Task, TaskState, TaskStatus } from "@/types";

interface SetTasksPayload {
    tasks: Task[];
    isManager: boolean;
}

const initialState: TaskState = {
    tasks: [],
    loading: false,
    activeTaskId: null,
    activeTask: null,
    error: null,
    isManager: false,

};

const taskSlice = createSlice({
    name: "task",
    initialState,
    reducers: {
        // ---------------------------
        // Loading & Error
        // ---------------------------
        setTaskLoading(state) {
            state.loading = true;
            state.error = null;
        },
        setTaskError(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        clearTaskError(state) {
            state.error = null;
        },

        // ---------------------------
        // CRUD Reducers
        // ---------------------------
        setTasks(state, action: PayloadAction<SetTasksPayload>) {
            state.tasks = action.payload.tasks;
            state.loading = false;
            state.isManager = action.payload.isManager;
        },

        addTask(state, action: PayloadAction<Task>) {
            state.tasks.push(action.payload);
        },

        updateTask(state, action: PayloadAction<Task>) {
            const idx = state.tasks.findIndex(
                (t) => t.id === action.payload.id
            );

            if (idx !== -1) {
                state.tasks[idx] = action.payload;
            }

            // KEEP ACTIVE TASK IN SYNC
            if (state.activeTaskId === action.payload.id) {
                state.activeTask = action.payload;
            }
        },

        removeTask(state, action: PayloadAction<string>) {
            state.tasks = state.tasks.filter(
                (t) => t.id !== action.payload
            );

            if (state.activeTaskId === action.payload) {
                state.activeTaskId = null;
                state.activeTask = null;
            }
        },

        // ---------------------------
        // Status Update (Kanban Drag)
        // ---------------------------
        updateTaskStatusLocally(
            state,
            action: PayloadAction<{ taskId: string; status: TaskStatus }>
        ) {
            const task = state.tasks.find(
                (t) => t.id === action.payload.taskId
            );

            if (task) {
                task.status = action.payload.status;
            }

            if (state.activeTask?.id === action.payload.taskId) {
                state.activeTask.status = action.payload.status;
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
    setTasks,
    addTask,
    updateTask,
    removeTask,
    setTaskLoading,
    setTaskError,
    clearTaskError,
    updateTaskStatusLocally,
    setActiveTask,
} = taskSlice.actions;

export default taskSlice.reducer;
