import { useRef } from "react";
import { Paperclip, X } from "lucide-react";

interface AttachmentManagerProps {
  files: File[];
  onAdd: (newFiles: File[]) => void;
  onRemove: (index: number) => void;
  disabled?: boolean;
}

export function AttachmentManager({
  files,
  onAdd,
  onRemove,
  disabled,
}: AttachmentManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onAdd(Array.from(e.target.files));
    }
  };

  return (
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
        disabled={disabled}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
        className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-700 p-3 text-sm text-gray-400 hover:border-purple-500 hover:text-white transition-all disabled:opacity-50"
      >
        <Paperclip size={18} />
        {files.length > 0 ? `${files.length} files selected` : "Upload Files"}
      </button>

      {files.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {files.map((file, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-md bg-[#141619] px-2 py-1 text-xs text-gray-300 border border-gray-700"
            >
              <span className="truncate max-w-[120px]">{file.name}</span>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => onRemove(i)}
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
  );
}
