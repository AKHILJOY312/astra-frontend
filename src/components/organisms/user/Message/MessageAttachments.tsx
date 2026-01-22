import { useState } from "react";
import { Download, Eye, File, ImageOff } from "lucide-react";
import { getAttachmentAccessUrl } from "@/services/attachments.service";
import type { Attachment, DispositionType } from "@/types";

export function MessageAttachments({
  attachments,
}: {
  attachments: Attachment[];
}) {
  const [imageError, setImageError] = useState(false);
  const handleAccess = async (
    attachmentId: string,
    disposition: DispositionType,
  ) => {
    const url = await getAttachmentAccessUrl(attachmentId, disposition);

    if (disposition === "view") {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      const a = document.createElement("a");
      a.href = url;
      a.download = "";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="mt-2 space-y-2">
      {attachments.map((file) => {
        const isImage = file.fileType.startsWith("image/");

        return (
          <div
            key={file.id}
            className="flex items-center gap-3 p-2 rounded-md bg-[#1F2125] border border-gray-700"
          >
            {/* Preview */}
            {isImage && file.thumbnailUrl && !imageError ? (
              <div
                onClick={() => handleAccess(file.id, "view")}
                className="cursor-pointer"
              >
                <img
                  src={file.thumbnailUrl}
                  alt={file.fileName}
                  onError={() => setImageError(true)}
                  className="w-12 h-12 object-cover rounded"
                />
              </div>
            ) : (
              <div className="w-12 h-12 flex items-center justify-center bg-gray-700 rounded">
                {isImage ? (
                  <ImageOff size={18} className="text-gray-400" />
                ) : (
                  <File size={18} className="text-gray-400" />
                )}
              </div>
            )}

            {/* Meta */}
            <div className="flex-1 overflow-hidden">
              <p className="text-sm truncate">{file.fileName}</p>
              <p className="text-xs text-gray-400">
                {(file.fileSize / 1024).toFixed(1)} KB
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 text-xs">
              <button
                onClick={() => handleAccess(file.id, "view")}
                className="text-blue-400 hover:underline"
              >
                <Eye size={14} className="inline-block mr-1" />
              </button>
              <button
                onClick={() => handleAccess(file.id, "download")}
                className="text-green-400 hover:underline"
              >
                <Download size={14} className="inline-block mr-1" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
