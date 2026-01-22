import { useState } from "react";
import {
  X,
  Edit2,
  Trash2,
  CheckCircle2,
  Flag,
  Calendar,
  Paperclip,
  ExternalLink,
} from "lucide-react";
import type {
  Task,
  TaskStatus,
  TaskPriority,
  DispositionType,
  EditTaskRequest,
} from "@/types";
import { STATUS_LABELS, PRIORITY_COLORS } from "@/utils/constants";
import { getAttachmentAccessUrl } from "@/services/attachments.service";
import { EditTaskForm } from "./EditTaskForm";
import { generateFallbackAvatar } from "@/utils/utils";
// import { useTasks } from "@/hooks/useTasks";

// --- Sub-Component: Modal Header ---
const ModalHeader = ({
  title,
  status,
  onClose,
}: {
  title: string;
  status: TaskStatus;
  onClose: () => void;
}) => (
  <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4 bg-[#232529]">
    <div className="flex items-center gap-2">
      <div
        className={`h-2 w-2 rounded-full ${status === "done" ? "bg-emerald-500" : "bg-blue-500"} animate-pulse`}
      />
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
        {title}
      </h3>
    </div>
    <button
      onClick={onClose}
      className="text-gray-400 hover:text-white transition-colors"
    >
      <X size={20} />
    </button>
  </div>
);

// --- Sub-Component: Task Metadata (Fixed Null Type Error) ---
const TaskMetadata = ({
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

// --- Sub-Component: Attachments ---
const TaskAttachments = ({
  attachments,
}: {
  attachments: Task["attachments"];
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (
      parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) +
      " " +
      ["Bytes", "KB", "MB", "GB"][i]
    );
  };

  const handleAccess = async (
    id: string,
    disposition: DispositionType = "task",
  ) => {
    const url = await getAttachmentAccessUrl(id, disposition);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="space-y-3">
      <label className="text-[10px] font-bold uppercase text-gray-500">
        Attachments ({attachments.length})
      </label>
      {attachments.map((file) => (
        <div
          key={file.id}
          onClick={() => handleAccess(file.id)}
          className="group flex items-center justify-between p-3 rounded-xl bg-[#131517] border border-gray-800 hover:border-blue-500/50 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Paperclip
              size={16}
              className="text-gray-400 group-hover:text-blue-400"
            />
            <div className="flex flex-col">
              <span className="text-xs text-gray-200">{file.fileName}</span>
              <span className="text-[10px] text-gray-500">
                {formatFileSize(file.fileSize)}
              </span>
            </div>
          </div>
          <ExternalLink size={14} className="text-gray-500" />
        </div>
      ))}
    </div>
  );
};

// --- Sub-Component: Modal Footer ---
interface FooterProps {
  isManager: boolean;
  isEditing: boolean;
  onDelete: () => void;
  onSave: () => void;
  onEdit: () => void;
  onCancel: () => void;
}

const ModalFooter = ({
  isManager,
  isEditing,
  onDelete,
  onSave,
  onEdit,
  onCancel,
}: FooterProps) => {
  if (!isManager) return null;
  return (
    <div className="flex items-center justify-between pt-6 border-t border-gray-800">
      <button
        onClick={() => window.confirm("Delete?") && onDelete()}
        className="flex items-center gap-2 text-xs text-red-400"
      >
        <Trash2 size={14} /> Delete Task
      </button>
      <div className="flex gap-3">
        {isEditing ? (
          <>
            <button onClick={onCancel} className="text-xs text-gray-400 px-3">
              Cancel
            </button>
            <button
              onClick={onSave}
              className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white"
            >
              Save Changes
            </button>
          </>
        ) : (
          <button
            onClick={onEdit}
            className="flex items-center gap-2 rounded-lg bg-gray-800 px-5 py-2 text-xs font-bold text-white"
          >
            <Edit2 size={14} /> Edit Task
          </button>
        )}
      </div>
    </div>
  );
};

// --- Main Page/Modal Component ---
interface TaskDetailsModalProps {
  isManager: boolean;
  task: Task;
  currentUserId?: string;
  onClose: () => void;
  onUpdate: (taskId: string, data: EditTaskRequest) => void;
  onDelete: (taskId: string) => void;
  onChangeStatus: (taskId: string, status: TaskStatus) => void;
}

export default function TaskDetailsModal({
  isManager,
  task,
  projectId,
  currentUserId,
  onClose,
  onUpdate,
  onDelete,
  onChangeStatus,
}: TaskDetailsModalProps & { projectId: string }) {
  const [isEditing, setIsEditing] = useState(false);

  // Status logic for View Mode
  const STATUS_FLOW: Record<TaskStatus, TaskStatus[]> = {
    todo: ["inprogress"],
    inprogress: ["done"],
    done: [],
  };
  const allowedNextStatuses = STATUS_FLOW[task.status];
  const isAssignedUser = task.assignedTo?.id === currentUserId;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-gray-800 bg-[#1c1e22]"
        onClick={(e) => e.stopPropagation()}
      >
        <ModalHeader
          title={isEditing ? "Edit Task" : "Task Details"}
          status={task.status}
          onClose={onClose}
        />

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {isEditing ? (
            /* --- EDIT MODE (Formik + S3 Logic) --- */
            <EditTaskForm
              task={task}
              projectId={projectId}
              onCancel={() => setIsEditing(false)}
              onSave={async (updatedData) => {
                onUpdate(task.id, updatedData);
                setIsEditing(false);
              }}
            />
          ) : (
            /* --- VIEW MODE --- */
            <>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gray-500">
                  Title
                </label>
                <h2 className="text-xl font-semibold text-white">
                  {task.title}
                </h2>
              </div>

              <TaskMetadata
                priority={task.priority}
                dueDate={task.dueDate || undefined}
              />
              {/* --- ADDED ASSIGNEE SECTION --- */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Assignee
                </label>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#131517] border border-gray-800/50">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600/20 border border-blue-500/30 text-xs font-bold text-blue-400">
                    {task.assignedTo
                      ? generateFallbackAvatar(task.assignedTo.name)
                      : "?"}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-200 font-medium leading-none">
                      {task.assignedTo?.name || "Unassigned"}
                    </span>
                    {task.assignedTo?.email && (
                      <span className="text-[10px] text-gray-500 mt-1">
                        {task.assignedTo.email}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gray-500">
                  Description
                </label>
                <p className="text-sm text-gray-400 bg-[#131517] p-4 rounded-xl min-h-20">
                  {task.description || "No description."}
                </p>
              </div>

              <TaskAttachments attachments={task.attachments} />

              {isAssignedUser && allowedNextStatuses.length > 0 && (
                <div className="flex gap-2 p-4 bg-blue-500/5 rounded-xl border border-blue-500/10">
                  {allowedNextStatuses.map((s) => (
                    <button
                      key={s}
                      onClick={() => onChangeStatus(task.id, s)}
                      className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white transition-all active:scale-95"
                    >
                      <CheckCircle2 size={14} /> Move to {STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              )}

              <ModalFooter
                isManager={isManager}
                isEditing={false}
                onDelete={() => onDelete(task.id)}
                onEdit={() => setIsEditing(true)}
                // These are ignored in View Mode by our ModalFooter logic
                onSave={() => {}}
                onCancel={() => {}}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
