import { useEffect, useState, useRef } from "react";
import { Paperclip, X, User, Loader2 } from "lucide-react";
import type {
  AssignableMember,
  TaskPriority,
  CreateTaskRequest,
} from "@/types";
import { useDebounce } from "@/hooks/useDebounce";
import { useTasks } from "@/hooks/useTasks";
import { requestTaskAttachmentUploadUrl } from "@/services/task.service";
import axios from "axios";

interface CreateTaskModalProps {
  projectId: string;
  onClose: () => void;
  onCreate: (data: CreateTaskRequest) => void;
}

const PRIORITIES: TaskPriority[] = ["low", "medium", "high"];

export default function CreateTaskModal({
  projectId,
  onClose,
  onCreate,
}: CreateTaskModalProps) {
  const [form, setForm] = useState<CreateTaskRequest>({
    title: "",
    description: "",
    assignedTo: "",
    priority: "medium",
  });

  const [attachments, setAttachments] = useState<File[]>([]);
  const [assigneeQuery, setAssigneeQuery] = useState("");
  const [members, setMembers] = useState<AssignableMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(assigneeQuery, 500);
  const { searchMembers } = useTasks(projectId);

  useEffect(() => {
    if (!debouncedQuery.trim() || form.assignedTo) {
      setMembers([]);
      return;
    }
    let active = true;
    const loadMembers = async () => {
      setLoadingMembers(true);
      try {
        const res = await searchMembers({ projectId, query: debouncedQuery });
        if (active) setMembers(res.members);
      } finally {
        setLoadingMembers(false);
      }
    };
    loadMembers();
    return () => {
      active = false;
    };
  }, [debouncedQuery, projectId, searchMembers, form.assignedTo]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const submit = async () => {
    if (!form.title.trim() || !form.assignedTo.trim()) return;

    try {
      setIsUploading(true);
      const uploadedMetadata = [];

      // 1. Process and upload each file to S3
      for (const file of attachments) {
        const { uploadUrl, fileKey } = await requestTaskAttachmentUploadUrl(
          projectId,
          {
            taskId: "temp-id",
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
          },
        );

        await axios.put(uploadUrl, file, {
          headers: { "Content-Type": file.type },
        });

        uploadedMetadata.push({
          fileName: file.name,
          fileUrl: fileKey, // Storing the S3 key/path
          fileType: file.type,
          fileSize: file.size,
        });
      }

      // 2. Finalize Task Creation
      onCreate({
        ...form,
        description: form.description || undefined,
        dueDate: form.dueDate || undefined,
        attachments: uploadedMetadata.length > 0 ? uploadedMetadata : undefined,
      });

      onClose();
    } catch (error) {
      console.error("Task creation failed:", error);
      alert("Failed to upload attachments or create task. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-gray-700 bg-[#1e2023] shadow-2xl">
        <div className="p-6 space-y-5">
          <header className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">New Task</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </header>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">
                Title *
              </label>
              <input
                disabled={isUploading}
                className="w-full rounded-lg border border-gray-700 bg-[#141619] p-2.5 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                placeholder="What needs to be done?"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">
                Description
              </label>
              <textarea
                disabled={isUploading}
                rows={3}
                className="w-full rounded-lg border border-gray-700 bg-[#141619] p-2.5 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all resize-none"
                placeholder="Add more details..."
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            {/* Assignee Selection */}
            <div className="relative">
              <label className="block text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">
                Assignee *
              </label>
              <div className="relative">
                <input
                  disabled={isUploading}
                  className="w-full rounded-lg border border-gray-700 bg-[#141619] p-2.5 pl-10 text-white focus:border-purple-500 focus:outline-none transition-all"
                  placeholder="Search members..."
                  value={assigneeQuery}
                  onChange={(e) => {
                    setAssigneeQuery(e.target.value);
                    if (form.assignedTo) setForm({ ...form, assignedTo: "" });
                  }}
                />
                <User
                  className="absolute left-3 top-3 text-gray-500"
                  size={18}
                />
              </div>

              {!isUploading && members.length > 0 && (
                <div className="absolute z-10 mt-1 w-full max-h-40 overflow-y-auto rounded-lg border border-gray-700 bg-[#1e2023] shadow-xl">
                  {members.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => {
                        setForm({ ...form, assignedTo: user.id });
                        setAssigneeQuery(user.name || user.email);
                        setMembers([]);
                      }}
                      className="flex w-full items-center gap-3 p-3 hover:bg-white/5 transition-colors border-b border-gray-800 last:border-0"
                    >
                      <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold">
                        {user.name?.[0] || "?"}
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium text-white">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Row: Priority & Due Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">
                  Priority
                </label>
                <select
                  disabled={isUploading}
                  className="w-full rounded-lg border border-gray-700 bg-[#141619] p-2.5 text-white focus:border-purple-500 focus:outline-none transition-all appearance-none"
                  value={form.priority}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      priority: e.target.value as TaskPriority,
                    })
                  }
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">
                  Due Date
                </label>
                <input
                  disabled={isUploading}
                  type="datetime-local"
                  className="w-full rounded-lg border border-gray-700 bg-[#141619] p-2.5 text-white focus:border-purple-500 focus:outline-none transition-all"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      dueDate: e.target.value
                        ? new Date(e.target.value).toISOString()
                        : undefined,
                    })
                  }
                />
              </div>
            </div>

            {/* Attachments */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">
                Attachments
              </label>
              <input
                type="file"
                multiple
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
                disabled={isUploading}
              />
              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-700 p-3 text-sm text-gray-400 hover:border-purple-500 hover:text-white transition-all disabled:opacity-50"
              >
                <Paperclip size={18} />
                {attachments.length > 0
                  ? `${attachments.length} files selected`
                  : "Upload Files"}
              </button>

              {attachments.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {attachments.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded-md bg-[#141619] px-2 py-1 text-xs text-gray-300 border border-gray-700"
                    >
                      <span className="truncate max-w-[120px]">
                        {file.name}
                      </span>
                      {!isUploading && (
                        <button
                          onClick={() => removeAttachment(i)}
                          className="text-gray-500 hover:text-red-400"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              onClick={onClose}
              disabled={isUploading}
              className="rounded-lg px-5 py-2 text-sm font-medium text-gray-400 hover:bg-white/5 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={isUploading || !form.title || !form.assignedTo}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-2 text-sm font-bold text-white shadow-lg shadow-purple-900/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:grayscale transition-all"
            >
              {isUploading && <Loader2 size={16} className="animate-spin" />}
              {isUploading ? "Uploading..." : "Create Task"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
