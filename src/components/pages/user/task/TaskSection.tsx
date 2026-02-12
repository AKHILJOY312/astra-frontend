import type { MyTasks } from "@/types/myTasks.types";

import { TaskRow } from "./TaskRow";

export const TaskSection = ({
  title,
  tasks,
  status,
}: {
  title: string;
  tasks: MyTasks[];
  status: string;
}) => {
  if (tasks.length === 0) return null;

  return (
    <div className="mb-8">
      {/* Sticky Header with Counter */}
      <div className="flex items-center gap-3 py-2 px-2 sticky top-0 bg-[#1a1d21] z-10 border-b border-gray-800/50 mb-3">
        <div
          className={`w-2 h-2 rounded-full ${
            status === "done"
              ? "bg-green-500"
              : status === "inprogress"
                ? "bg-purple-500"
                : "bg-gray-500"
          }`}
        />
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          {title}
        </h3>
        <span className="text-[10px] bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full font-mono">
          {tasks.length}
        </span>
      </div>

      {/* Task Rows */}
      <div className="space-y-1">
        {tasks.map((task) => (
          <TaskRow key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};
