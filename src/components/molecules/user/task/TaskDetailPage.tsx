import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import type { Task, TaskStatus, EditTaskRequest } from "@/types";
import { STATUS_LABELS } from "@/utils/constants";
import { EditTaskForm } from "@/components/organisms/user/task/EditTaskForm";
import { generateFallbackAvatar } from "@/utils/utils";
import { ModalFooter } from "@/components/atoms/user/task/ModalFooter";
import { ModalHeader } from "@/components/atoms/user/task/ModalHeader";
import { TaskMetadata } from "@/components/atoms/user/task/TaskMetadata";
import { TaskAttachments } from "@/components/molecules/user/task/TaskAttachments";
// import { useTasks } from "@/hooks/useTasks";

// --- Main Page/Modal Component ---
interface TaskDetailsModalProps {
  isManager: boolean;
  task: Task;
  currentUserId?: string;
  onClose: () => void;
  onUpdate: (taskId: string, data: EditTaskRequest) => void;
  onDelete: (task: Task) => void;
  onChangeStatus: (task: Task, status: TaskStatus) => void;
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
                      onClick={() => onChangeStatus(task, s)}
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
                onDelete={() => onDelete(task)}
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
