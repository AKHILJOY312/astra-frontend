import type { DispositionType, Task, TaskStatus } from "@/types";
import { STATUS_LABELS, PRIORITY_COLORS } from "@/utils/constants";
import { generateFallbackAvatar } from "@/utils/utils";
import { useState } from "react";
import {
  X,
  Edit2,
  Trash2,
  CheckCircle2,
  Calendar,
  Flag,
  Paperclip,
  ExternalLink,
} from "lucide-react";
import { getAttachmentAccessUrl } from "@/services/attachments.service";

interface TaskDetailsModalProps {
  isManager: boolean;
  task: Task;
  currentUserId?: string;
  onClose: () => void;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onChangeStatus: (taskId: string, status: TaskStatus) => void;
}

export default function TaskDetailsModal({
  isManager,
  task,
  currentUserId,
  onClose,
  onUpdate,
  onDelete,
  onChangeStatus,
}: TaskDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<Task>(task);
  const isAssignedUser = task.assignedTo?.id === currentUserId;

  const STATUS_FLOW: Record<TaskStatus, TaskStatus[]> = {
    todo: ["inprogress"],
    inprogress: ["done"],
    done: [],
  };

  const statusColors: Record<TaskStatus, string> = {
    todo: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    inprogress: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    done: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  const allowedNextStatuses = STATUS_FLOW[task.status];

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const saveChanges = () => {
    onUpdate(draft);
    setIsEditing(false);
  };
  const handleAccess = async (
    attachmentId: string,
    disposition: DispositionType = "task",
  ) => {
    const url = await getAttachmentAccessUrl(attachmentId, disposition);

    window.open(url, "_blank", "noopener,noreferrer");
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-gray-800 bg-[#1c1e22] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4 bg-[#232529]">
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${task.status === "done" ? "bg-emerald-500" : "bg-blue-500"} animate-pulse`}
            />
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
              {isEditing ? "Edit Task" : "Task Details"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {/* Title Section */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Title
            </label>
            {isEditing ? (
              <input
                className="w-full rounded-lg border border-gray-700 bg-[#131517] p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              />
            ) : (
              <h2 className="text-xl font-semibold text-white tracking-tight">
                {task.title}
              </h2>
            )}
          </div>

          {/* Metadata Row: Priority & Due Date */}
          <div className="grid grid-cols-2 gap-6 p-4 rounded-xl bg-[#131517] border border-gray-800/50">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-500">
                <Flag size={14} />
                <label className="text-[10px] font-bold uppercase tracking-widest">
                  Priority
                </label>
              </div>
              <span
                className={`inline-block px-3 py-1 rounded-md text-[10px] font-bold uppercase border ${PRIORITY_COLORS[task.priority]}`}
              >
                {task.priority}
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
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString(undefined, {
                      dateStyle: "medium",
                    })
                  : "No deadline"}
              </p>
            </div>
          </div>

          {/* Status & Assignee Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                Status
              </label>
              {isEditing ? (
                <select
                  value={draft.status}
                  onChange={(e) =>
                    setDraft({ ...draft, status: e.target.value as TaskStatus })
                  }
                  className="w-full rounded-lg border border-gray-700 bg-[#131517] p-2.5 text-sm text-white outline-none"
                >
                  {Object.entries(STATUS_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              ) : (
                <div
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusColors[task.status]}`}
                >
                  {STATUS_LABELS[task.status]}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                Assignee
              </label>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600/20 border border-blue-500/30 text-[10px] font-bold text-blue-400">
                  {task.assignedTo
                    ? generateFallbackAvatar(task.assignedTo.name)
                    : "?"}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-200 font-medium leading-none">
                    {task.assignedTo?.name || "Unassigned"}
                  </span>
                  <span className="text-[10px] text-gray-500 mt-1">
                    {task.assignedTo?.email}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Description
            </label>
            {isEditing ? (
              <textarea
                rows={4}
                className="w-full rounded-lg border border-gray-700 bg-[#131517] p-3 text-sm text-white focus:border-blue-500 outline-none resize-none"
                value={draft.description || ""}
                onChange={(e) =>
                  setDraft({ ...draft, description: e.target.value })
                }
              />
            ) : (
              <p className="text-sm leading-relaxed text-gray-400 bg-[#131517] p-4 rounded-xl border border-gray-800/50 min-h-[80px]">
                {task.description || "No description provided."}
              </p>
            )}
          </div>

          {/* Attachments Section */}
          {task.attachments && task.attachments.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Attachments ({task.attachments.length})
                </label>
              </div>

              <div className="grid gap-2">
                {task.attachments.map((file) => (
                  <div
                    key={file.id}
                    // Remove the <a> wrapper and use the div for the click handler
                    onClick={() => handleAccess(file.id)}
                    title="Click to view document"
                    className="group flex items-center justify-between p-3 rounded-xl bg-[#131517] border border-gray-800 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="p-2 rounded-lg bg-gray-800 text-gray-400 group-hover:text-blue-400 group-hover:bg-blue-900/20 transition-colors">
                        <Paperclip size={16} />
                      </div>

                      <div className="flex flex-col overflow-hidden">
                        <span className="text-xs text-gray-200 font-medium truncate group-hover:text-blue-300">
                          {file.fileName}
                        </span>
                        <span className="text-[10px] text-gray-500">
                          {formatFileSize(file.fileSize)} • AWS S3 Cloud
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 group-hover:text-blue-400 uppercase tracking-tighter">
                      <span>View</span>
                      <ExternalLink size={14} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {!isEditing && isAssignedUser && allowedNextStatuses.length > 0 && (
            <div className="rounded-xl bg-blue-500/5 border border-blue-500/10 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-3">
                Update Progress
              </p>
              <div className="flex gap-2">
                {allowedNextStatuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => onChangeStatus(task.id, status)}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all active:scale-95"
                  >
                    <CheckCircle2 size={14} />
                    Move to {STATUS_LABELS[status]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          {isManager && (
            <div className="flex items-center justify-between pt-6 border-t border-gray-800">
              <button
                onClick={() =>
                  window.confirm("Delete this task?") && onDelete(task.id)
                }
                className="flex items-center gap-2 text-xs font-medium text-red-400/80 hover:text-red-400 transition-colors"
              >
                <Trash2 size={14} />
                Delete Task
              </button>

              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveChanges}
                      className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-500 transition-all"
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-5 py-2 text-xs font-bold text-white hover:bg-gray-700 transition-all"
                  >
                    <Edit2 size={14} />
                    Edit Task
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
