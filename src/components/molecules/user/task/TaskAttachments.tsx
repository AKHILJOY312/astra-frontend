import { getAttachmentAccessUrl } from "@/services/attachments.service";
import type { DispositionType, Task } from "@/types";
import { ExternalLink, Paperclip } from "lucide-react";

// --- Sub-Component: Attachments ---
export const TaskAttachments = ({
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
