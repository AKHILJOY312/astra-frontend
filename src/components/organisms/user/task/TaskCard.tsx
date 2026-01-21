import { Info, Paperclip } from "lucide-react"; // Added Paperclip
import type { Task } from "@/types";
import { PRIORITY_COLORS } from "@/utils/constants";
import { generateFallbackAvatar } from "@/utils/utils";

interface TaskCardProps {
  task: Task;
  onOpen: (task: Task) => void;
}

export const TaskCard = ({ task, onOpen }: TaskCardProps) => {
  // Check if attachments exist based on your JSON structure
  const hasAttachments = task.attachments && task.attachments.length > 0;

  return (
    <div
      onClick={() => onOpen(task)}
      className="group cursor-pointer rounded-xl border border-gray-800 bg-[#1c1f24] p-4 transition-all hover:border-blue-500/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] hover:-translate-y-1 active:scale-[0.98]"
    >
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${PRIORITY_COLORS[task.priority]}`}
          >
            {task.priority}
          </span>
          <div className="flex items-center gap-2">
            {/* Attachment Icon with Count */}
            {hasAttachments && (
              <div className="flex items-center gap-1 text-gray-500 bg-gray-800/50 px-1.5 py-0.5 rounded-md">
                <Paperclip size={12} />
                <span className="text-[10px] font-medium">
                  {task.attachments.length}
                </span>
              </div>
            )}
            <Info
              size={14}
              className="text-gray-600 group-hover:text-gray-400 transition-colors"
            />
          </div>
        </div>

        <h3 className="font-semibold text-sm md:text-base leading-tight group-hover:text-blue-400 transition-colors line-clamp-2">
          {task.title}
        </h3>

        <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-800/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-900/30 border border-blue-500/20 text-[10px] font-bold text-blue-400">
              {task.assignedTo
                ? generateFallbackAvatar(task.assignedTo.name)
                : "?"}
            </div>
            <span className="text-xs text-gray-400 truncate max-w-[80px] md:max-w-[120px]">
              {task.assignedTo?.name || "Unassigned"}
            </span>
          </div>

          {task.dueDate && (
            <div className="text-right">
              <p className="text-[9px] text-gray-500 uppercase font-bold">
                Due
              </p>
              <p className="text-[11px] text-gray-300">
                {new Date(task.dueDate).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
