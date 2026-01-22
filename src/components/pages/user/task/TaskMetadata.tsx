import { Flag, Calendar } from "lucide-react";
import { PRIORITY_COLORS } from "@/utils/constants";
import type { TaskPriority } from "@/types";

export const TaskMetadata = ({
  priority,
  dueDate,
}: {
  priority: TaskPriority;
  dueDate?: string;
}) => (
  <div className="grid grid-cols-2 gap-6 p-4 rounded-xl bg-[#131517] border border-gray-800/50">
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-gray-500">
        <Flag size={14} />
        <label className="text-[10px] font-bold uppercase tracking-widest">
          Priority
        </label>
      </div>
      <span
        className={`inline-block px-3 py-1 rounded-md text-[10px] font-bold uppercase border ${PRIORITY_COLORS[priority]}`}
      >
        {priority}
      </span>
    </div>
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-gray-500">
        <Calendar size={14} />
        <label className="text-[10px] font-bold uppercase tracking-widest">
          Due Date
        </label>
      </div>
      <p className="text-sm text-gray-200">
        {dueDate
          ? new Date(dueDate).toLocaleDateString(undefined, {
              dateStyle: "medium",
            })
          : "No deadline"}
      </p>
    </div>
  </div>
);
