import { Paperclip, ExternalLink } from "lucide-react";
import type { Task, DispositionType } from "@/types";
import { getAttachmentAccessUrl } from "@/services/attachments.service";

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i];
};

export const TaskAttachments = ({
  attachments,
}: {
  attachments: Task["attachments"];
}) => {
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
      <div className="grid gap-2">
        {attachments.map((file) => (
          <div
            key={file.id}
            onClick={() => handleAccess(file.id)}
            className="group flex items-center justify-between p-3 rounded-xl bg-[#131517] border border-gray-800 hover:border-blue-500/50 cursor-pointer transition-all"
          >
            <div className="flex items-center gap-3">
              <Paperclip
                size={16}
                className="text-gray-400 group-hover:text-blue-400"
              />
              <div className="flex flex-col">
                <span className="text-xs text-gray-200 truncate">
                  {file.fileName}
                </span>
                <span className="text-[10px] text-gray-50">
                  {formatFileSize(file.fileSize)}
                </span>
              </div>
            </div>
            <ExternalLink size={14} className="text-gray-500" />
          </div>
        ))}
      </div>
    </div>
  );
};
