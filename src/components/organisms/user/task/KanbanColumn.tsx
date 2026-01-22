import type { Task, TaskStatus } from "@/types";
import { STATUS_LABELS } from "@/utils/constants";
import { TaskCard } from "@/components/atoms/user/task/TaskCard";

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onOpenTask: (task: Task) => void;
}

export const KanbanColumn = ({
  status,
  tasks,
  onOpenTask,
}: KanbanColumnProps) => {
  return (
    <div className="flex-shrink-0 w-[85vw] sm:w-[350px] lg:w-full snap-center">
      <div className="flex items-center justify-between mb-5 px-2">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-gray-200 uppercase tracking-widest text-xs">
            {STATUS_LABELS[status] || status}
          </h2>
          <span className="bg-[#232529] text-[10px] px-2 py-0.5 rounded-full text-gray-400 font-mono">
            {tasks.length}
          </span>
        </div>
      </div>

      <div className="space-y-4 min-h-[60vh] rounded-2xl bg-[#16191d]/40 p-3 ring-1 ring-white/5 backdrop-blur-sm">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} onOpen={onOpenTask} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-800/50 rounded-2xl">
            <p className="text-gray-600 text-xs font-medium">
              No tasks in {status}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
