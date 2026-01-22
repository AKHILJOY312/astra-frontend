import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
// import axios from "axios";
import type { EditTaskRequest, Task, TaskPriority } from "@/types";
// import { requestTaskAttachmentUploadUrl } from "@/services/task.service";
import { AssigneeSelect } from "@/components/organisms/user/task/AssigneeSelect";
// import { useTasks } from "@/hooks/useTasks";
// import { AttachmentManager } from "@/components/organisms/user/task/AttachmentManager";

interface EditTaskFormProps {
  task: Task;
  projectId: string;
  onSave: (updatedData: EditTaskRequest) => void;
  onCancel: () => void;
}

const PRIORITIES: TaskPriority[] = ["low", "medium", "high"];

const TaskSchema = Yup.object().shape({
  title: Yup.string().min(3, "Title too short").required("Title is required"),
  description: Yup.string().max(500, "Description too long"),
  assignedTo: Yup.string().required("Please select an assignee"),
  priority: Yup.string().oneOf(PRIORITIES).required(),
  dueDate: Yup.string().optional(),
});

export const EditTaskForm = ({
  task,
  projectId,
  onSave,
  onCancel,
}: EditTaskFormProps) => {
  // const [newAttachments, setNewAttachments] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: task.title,
      description: task.description || "",
      assignedTo: task.assignedTo?.id || "",
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : "",
    },
    validationSchema: TaskSchema,
    onSubmit: async (values: EditTaskRequest) => {
      try {
        setIsUploading(true);
        // let uploadedMetadata = [];

        // // 1. Handle New S3 Uploads (if any)
        // for (const file of newAttachments) {
        //   const { uploadUrl, fileKey } = await requestTaskAttachmentUploadUrl(
        //     projectId,
        //     {
        //       taskId: task.id,
        //       fileName: file.name,
        //       fileSize: file.size,
        //       fileType: file.type,
        //     },
        //   );

        //   await axios.put(uploadUrl, file, {
        //     headers: { "Content-Type": file.type },
        //   });

        //   uploadedMetadata.push({
        //     fileName: file.name,
        //     fileUrl: fileKey,
        //     fileType: file.type,
        //     fileSize: file.size,
        //   });
        // }

        // 2. Merge existing data with new changes
        onSave(
          values,
          // If you want to append new attachments to existing ones,
          // your backend should handle the merge, or you pass the full list here.
          // attachments:
          //   uploadedMetadata.length > 0 ? uploadedMetadata : undefined,
        );
      } catch (error) {
        console.error("Update failed:", error);
        alert("Failed to update task.");
      } finally {
        setIsUploading(false);
      }
    },
  });

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase text-gray-500">
          Title
        </label>
        <input
          {...formik.getFieldProps("title")}
          className="w-full rounded-lg border border-gray-700 bg-[#131517] p-3 text-white outline-none focus:border-purple-500"
        />
      </div>

      {/* Meta Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-bold uppercase text-gray-500">
            Priority
          </label>
          <select
            {...formik.getFieldProps("priority")}
            className="w-full rounded-lg border border-gray-700 bg-[#131517] p-2.5 text-white outline-none"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase text-gray-500">
            Due Date
          </label>
          <input
            type="datetime-local"
            className="w-full rounded-lg border border-gray-700 bg-[#131517] p-2.5 text-white outline-none"
            value={formik.values.dueDate}
            onChange={(e) => formik.setFieldValue("dueDate", e.target.value)}
          />
        </div>
      </div>

      {/* Assignee */}
      <AssigneeSelect
        projectId={projectId}
        selectedId={formik.values.assignedTo!}
        onSelect={(id) => formik.setFieldValue("assignedTo", id)}
      />

      {/* Description */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase text-gray-500">
          Description
        </label>
        <textarea
          {...formik.getFieldProps("description")}
          rows={4}
          className="w-full rounded-lg border border-gray-700 bg-[#131517] p-3 text-sm text-white resize-none outline-none focus:border-purple-500"
        />
      </div>

      {/* New Attachments */}
      {/* <AttachmentManager
        files={newAttachments}
        disabled={isUploading}
        onAdd={(files) => setNewAttachments((prev) => [...prev, ...files])}
        onRemove={(index) =>
          setNewAttachments((prev) => prev.filter((_, i) => i !== index))
        }
      /> */}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={() => formik.handleSubmit()}
          disabled={isUploading || !formik.dirty}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white disabled:opacity-50"
        >
          {isUploading && <Loader2 size={14} className="animate-spin" />}
          {isUploading ? "Updating..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};
