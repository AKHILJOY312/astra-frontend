import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import type { CreateTaskRequest, TaskPriority } from "@/types";
import { requestTaskAttachmentUploadUrl } from "@/services/task.service";
import { AssigneeSelect } from "./AssigneeSelect";
import { AttachmentManager } from "./AttachmentManager";

interface CreateTaskModalProps {
  projectId: string;
  onClose: () => void;
  onCreate: (data: CreateTaskRequest) => void;
}

const PRIORITIES: TaskPriority[] = ["low", "medium", "high"];

// --- Validation Schema ---
const TaskSchema = Yup.object().shape({
  title: Yup.string().min(3, "Title too short").required("Title is required"),
  description: Yup.string().max(500, "Description too long"),
  assignedTo: Yup.string().required("Please select an assignee"),
  priority: Yup.string().oneOf(PRIORITIES).required(),
  dueDate: Yup.string().optional(),
});

export default function CreateTaskModal({
  projectId,
  onClose,
  onCreate,
}: CreateTaskModalProps) {
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // --- Formik Hook ---
  const formik = useFormik<CreateTaskRequest>({
    initialValues: {
      title: "",
      description: "",
      assignedTo: "",
      priority: "medium",
    },
    validationSchema: TaskSchema,
    onSubmit: async (values) => {
      try {
        setIsUploading(true);
        const uploadedMetadata = [];

        // Handle S3 Uploads
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
            fileUrl: fileKey,
            fileType: file.type,
            fileSize: file.size,
          });
        }

        onCreate({
          ...values,
          attachments:
            uploadedMetadata.length > 0 ? uploadedMetadata : undefined,
        });
        onClose();
      } catch (error) {
        console.error("Task creation failed:", error);
        alert("Failed to create task.");
      } finally {
        setIsUploading(false);
      }
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full max-w-lg max-h-[90vh] rounded-2xl border border-gray-700 bg-[#1e2023] shadow-2xl flex flex-col             
    overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-gray-800 shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">New Task</h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={22} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-medium uppercase text-gray-400 mb-1">
                Title *
              </label>
              <input
                disabled={isUploading}
                className={`w-full rounded-lg border bg-[#141619] p-2.5 text-white focus:outline-none transition-all ${
                  formik.touched.title && formik.errors.title
                    ? "border-red-500"
                    : "border-gray-700 focus:border-purple-500"
                }`}
                placeholder="What needs to be done?"
                {...formik.getFieldProps("title")}
              />
              {formik.touched.title && formik.errors.title && (
                <p className="mt-1 text-xs text-red-500">
                  {formik.errors.title}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium uppercase text-gray-400 mb-1">
                Description
              </label>
              <textarea
                disabled={isUploading}
                rows={3}
                className="w-full rounded-lg border border-gray-700 bg-[#141619] p-2.5 text-white focus:border-purple-500 focus:outline-none resize-none"
                placeholder="Add more details..."
                {...formik.getFieldProps("description")}
              />
            </div>

            {/* Assignee Component */}
            <div>
              <AssigneeSelect
                projectId={projectId}
                selectedId={formik.values.assignedTo}
                disabled={isUploading}
                onSelect={(id) => formik.setFieldValue("assignedTo", id)}
              />
              {formik.touched.assignedTo && formik.errors.assignedTo && (
                <p className="mt-1 text-xs text-red-500">
                  {formik.errors.assignedTo}
                </p>
              )}
            </div>

            {/* Priority & Due Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium uppercase text-gray-400 mb-1">
                  Priority
                </label>
                <select
                  disabled={isUploading}
                  className="w-full rounded-lg border border-gray-700 bg-[#141619] p-2.5 text-white appearance-none"
                  {...formik.getFieldProps("priority")}
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase text-gray-400 mb-1">
                  Due Date
                </label>
                <input
                  type="datetime-local"
                  disabled={isUploading}
                  className="w-full rounded-lg border border-gray-700 bg-[#141619] p-2.5 text-white"
                  onChange={(e) =>
                    formik.setFieldValue(
                      "dueDate",
                      e.target.value
                        ? new Date(e.target.value).toISOString()
                        : "",
                    )
                  }
                />
              </div>
            </div>

            <AttachmentManager
              files={attachments}
              disabled={isUploading}
              onAdd={(newFiles) =>
                setAttachments((prev) => [...prev, ...newFiles])
              }
              onRemove={(index) =>
                setAttachments((prev) => prev.filter((_, i) => i !== index))
              }
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-800 flex justify-end gap-4 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="px-5 py-2 text-sm text-gray-400 hover:text-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUploading || !formik.isValid || !formik.dirty}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-2 text-sm font-bold text-white transition-all disabled:opacity-50"
          >
            {isUploading && <Loader2 size={16} className="animate-spin" />}
            {isUploading ? "Uploading..." : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
}
