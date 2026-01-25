import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Layout, Plus } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { useAuth } from "@/hooks/useAuth";
import type { TaskStatus } from "@/types";

import TaskDetailsModal from "@/components/molecules/user/task/TaskDetailPage";
import CreateTaskModal from "@/components/organisms/user/task/CreateTaskModal";
import { KanbanColumn } from "@/components/organisms/user/task/KanbanColumn";

export default function KanbanBoard() {
  const { projectId } = useParams();
  const { user } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

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
    isManager,
  } = useTasks(projectId!);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const KANBAN_ORDER: TaskStatus[] = ["todo", "inprogress", "done"];

  return (
    <div className="min-h-screen bg-[#0f1113] text-gray-100 p-4 md:p-6 lg:p-8 pt-20 md:pt-24">
      <header className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Layout className="text-blue-500" size={24} />
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight pt-20">
              Project Board
            </h1>
          </div>
          <p className="text-gray-400 text-sm md:text-base">
            Manage and track your team tasks efficiently
          </p>
        </div>

        {isManager && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 transition-all px-6 py-3 font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus size={20} /> New Task
          </button>
        )}
      </header>

      {loading ? (
        <div className="flex h-96 items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className=" flex flex-col gap-8 lg:grid lg:grid-cols-3 lg:gap-6 lg:max-w-[1600px] lg:mx-auto">
          {KANBAN_ORDER.map((status) => (
            <div
              key={status}
              // w-full makes it take the whole width on mobile
              className="w-full"
            >
              <KanbanColumn
                status={status}
                tasks={tasks.filter((t) => t.status === status)}
                onOpenTask={openTask}
              />
            </div>
          ))}
        </div>
      )}

      {activeTask && (
        <TaskDetailsModal
          projectId={projectId!}
          isManager={isManager}
          task={activeTask}
          currentUserId={user?.id}
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
