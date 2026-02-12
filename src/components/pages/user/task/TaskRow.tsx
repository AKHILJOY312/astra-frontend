import type { MyTasks } from "@/types/myTasks.types";
import { Calendar, MoreVertical, Paperclip } from "lucide-react";
import { TaskStatusBadge } from "./TaskStatusBadge";

// --- Individual Task Row Component ---
export const TaskRow = ({ task }: { task: MyTasks }) => (
  <div className="group flex items-center px-4 py-3 rounded-xl border border-transparent hover:border-gray-800 hover:bg-[#232529]/50 transition-all cursor-pointer min-w-0">
    <div className="w-8">
      <div
        className={`w-5 h-5 rounded-full border-2 border-gray-700 flex items-center justify-center group-hover:border-purple-500 transition-colors ${task.status === "done" ? "bg-green-500/20 border-green-500" : ""}`}
      >
        {task.status === "done" && (
          <div className="w-2 h-2 bg-green-500 rounded-full" />
        )}
      </div>
    </div>
    <div className="flex-1 min-w-0 pr-4">
      <div className="flex items-center gap-2">
        <span
          className={`font-semibold truncate ${task.status === "done" ? "text-gray-500 line-through" : "text-white"}`}
        >
          {task.title}
        </span>
        {task.hasAttachments && <Paperclip className="w-3 h-3 text-gray-600" />}
      </div>
      {task.description && (
        <p className="text-xs text-gray-500 line-clamp-1 max-w-[400px] group-hover:text-gray-400 transition-colors">
          {task.description}
        </p>
      )}
    </div>
    <div className="w-32">
      <TaskStatusBadge status={task.status} />
    </div>
    <div className="w-32 flex items-center gap-2 text-xs text-gray-400">
      <Calendar className="w-3 h-3" />
      <span>
        {task.dueDate
          ? new Date(task.dueDate).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
            })
          : "—"}
      </span>
    </div>
    <div className="w-24 text-xs font-medium uppercase tracking-widest text-gray-400">
      {task.priority}
    </div>
    <div className="w-8 opacity-0 group-hover:opacity-100 transition-opacity">
      <MoreVertical className="w-4 h-4 text-gray-500" />
    </div>
  </div>
);
