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
    columns,
    activeTask,
    createTask,
    openTask,
    closeTask,
    loadMoreTasks,
    changeTaskStatus,
    deleteTask,
    updateTask,
    loadInitialTask,
    isManager,
  } = useTasks(projectId!);

  useEffect(() => {
    loadInitialTask("todo");
    loadInitialTask("inprogress");
    loadInitialTask("done");
  }, [loadInitialTask]);

  const KANBAN_ORDER: TaskStatus[] = ["todo", "inprogress", "done"];

  return (
    <div className="min-h-screen bg-[#0f1113] text-gray-100 p-4 md:p-6 lg:p-8 pt-20 md:pt-24">
      <header className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Layout className="text-blue-500" size={24} />
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
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

      <div className=" flex flex-col gap-8 lg:grid lg:grid-cols-3 lg:gap-6 lg:max-w-[1600px] lg:mx-auto">
        {KANBAN_ORDER.map((status) => {
          const column = columns[status];

          return (
            <KanbanColumn
              key={status}
              status={status}
              tasks={column.tasks}
              onOpenTask={openTask}
              onLoadMore={() => loadMoreTasks(status)}
              hasMore={column.hasMore}
              loading={column.loading}
            />
          );
        })}
      </div>

      {activeTask && (
        <TaskDetailsModal
          projectId={projectId!}
          isManager={isManager}
          task={activeTask}
          currentUserId={user?.id}
          onClose={closeTask}
          onUpdate={updateTask}
          onDelete={(task) => {
            deleteTask(task);
            closeTask();
          }}
          onChangeStatus={(task, status) => changeTaskStatus(task, { status })}
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
