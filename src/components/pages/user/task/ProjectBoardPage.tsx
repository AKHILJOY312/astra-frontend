import { useTasks } from "@/hooks/useTasks";
import type { Task, TaskStatus } from "@/types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TaskDetailsModal from "./TaskDetailPage";
import { STATUS_LABELS } from "@/utils/constants";
import CreateTaskModal from "@/components/organisms/user/task/CreateTaskModal";
import { generateFallbackAvatar } from "@/utils/utils";
import { useAuth } from "@/hooks/useAuth";

export const PRIORITY_COLORS = {
    low: "bg-green-500/10 text-green-400 border-green-500/20",
    medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    high: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    urgent: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function KanbanBoard() {
    const { projectId } = useParams();
    const {
        tasks,
        loading,
        activeTask,
        createTask,
        openTask,
        closeTask,
        changeTaskStatus,
        deleteTask,
        updateTask,
        loadTasks,
        isManager
    } = useTasks(projectId!);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);
    const KANBAN_ORDER: TaskStatus[] = ["todo", "inprogress", "done"];
    const statuses = KANBAN_ORDER;

    return (
        <div className="min-h-screen bg-[#0f1113] text-gray-100 p-4 md:p-8 pt-24">
            {/* Header Section */}
            <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Project Board</h1>
                    <p className="text-gray-400 text-sm mt-1">Manage and track your team tasks</p>
                </div>

                {isManager && (
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 transition-all px-5 py-2.5 font-semibold shadow-lg shadow-blue-900/20"
                    >
                        <span className="text-xl">+</span> New Task
                    </button>
                )}
            </div>

            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                /* Board Container - Allows horizontal scroll on small screens */
                <div className="flex overflow-x-auto pb-6 gap-6 snap-x">
                    {statuses.map((status) => {
                        const tasksForStatus = tasks.filter((task: Task) => task.status === status);

                        return (
                            <div key={status} className="flex-shrink-0 w-[300px] md:w-[350px] snap-center">
                                {/* Column Header */}
                                <div className="flex items-center justify-between mb-4 px-1">
                                    <h2 className="font-semibold text-gray-300 flex items-center gap-2">
                                        {STATUS_LABELS[status] || status}
                                        <span className="bg-[#232529] text-xs px-2 py-0.5 rounded-full text-gray-500">
                                            {tasksForStatus.length}
                                        </span>
                                    </h2>
                                </div>

                                {/* Task list container */}
                                <div className="space-y-4 min-h-[500px] rounded-2xl bg-[#16191d]/50 p-2 ring-1 ring-white/5">
                                    {tasksForStatus.length > 0 ? (
                                        tasksForStatus.map((task: Task) => (
                                            <div
                                                key={task.id}
                                                onClick={() => openTask(task)}
                                                className="group cursor-pointer rounded-xl border border-gray-800 bg-[#1c1f24] p-4 transition-all hover:border-gray-600 hover:shadow-xl hover:-translate-y-1 active:scale-[0.98]"
                                            >
                                                <div className="flex flex-col gap-3">
                                                    {/* Priority Badge */}
                                                    <span className={`self-start px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${PRIORITY_COLORS[task.priority]}`}>
                                                        {task.priority}
                                                    </span>

                                                    <h3 className="font-semibold leading-tight group-hover:text-blue-400 transition-colors">
                                                        {task.title}
                                                    </h3>

                                                    <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-800/50">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-7 h-7 rounded-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-600 text-[10px] font-bold">
                                                                {task.assignedTo ? generateFallbackAvatar(task.assignedTo.name) : "?"}
                                                            </div>
                                                            <span className="text-xs text-gray-400 truncate max-w-[100px]">
                                                                {task.assignedTo?.name || "Unassigned"}
                                                            </span>
                                                        </div>

                                                        {task.dueDate && (
                                                            <div className="flex flex-col items-end">
                                                                <span className="text-[10px] text-gray-500 uppercase font-medium">Due Date</span>
                                                                <span className="text-xs text-gray-300">
                                                                    {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-800 rounded-xl">
                                            <p className="text-gray-600 text-xs italic">No tasks yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modals */}
            {activeTask && (
                <TaskDetailsModal
                    isManager={isManager}
                    task={activeTask}
                    currentUserId={user?.id!}
                    onClose={closeTask}
                    onUpdate={updateTask}
                    onDelete={(id) => {
                        deleteTask(id);
                        closeTask();
                    }}
                    onChangeStatus={(taskId, status) =>
                        changeTaskStatus(taskId, { status })
                    }
                />
            )}

            {isCreateOpen && (
                <CreateTaskModal
                    projectId={projectId!}
                    onClose={() => setIsCreateOpen(false)}
                    onCreate={createTask}
                />
            )}
        </div>
    );
}