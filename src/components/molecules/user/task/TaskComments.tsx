import { useState } from "react";
import { MessageSquare, Plus } from "lucide-react";
import type { TaskComment } from "@/types";

interface TaskCaptionsProps {
  comment: TaskComment[];
  onUpdate: (updatedCaptions: string) => void;
}

export function TaskComments({ comment = [], onUpdate }: TaskCaptionsProps) {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    if (!inputValue.trim()) return;
    onUpdate(inputValue.trim());
    setInputValue("");
  };
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <div className="space-y-3">
      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
        <MessageSquare size={12} /> Comments
      </label>

      {/* View Mode: List of Captions */}
      <div className="space-y-2">
        {comment.length > 0 ? (
          comment.map((caption, index) => (
            <div
              key={index}
              className="bg-[#131517] px-3 py-2 rounded-lg border border-gray-800/40 hover:border-gray-700 transition-colors"
            >
              {/* Meta row */}
              <div className="flex items-center gap-2 text-[10px] text-gray-500">
                <span className="font-medium text-gray-400 truncate max-w-[120px]">
                  {caption.author?.name ?? "Unknown"}
                </span>
                <span className="opacity-60">•</span>
                <span className="whitespace-nowrap">
                  {formatDate(caption.createdAt)}
                </span>
              </div>

              {/* Message */}
              <p className="text-[13px] text-gray-300 leading-snug mt-0.5">
                {caption.message}
              </p>
            </div>
          ))
        ) : (
          <p className="text-[11px] text-gray-600 italic px-1">
            No captions added yet.
          </p>
        )}
      </div>

      {/* Add Mode: Input Field */}
      <div className="flex gap-2 pt-1">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Add a caption..."
          className="flex-1 bg-[#0d0f11] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
        />
        <button
          onClick={handleAdd}
          disabled={!inputValue.trim()}
          className="flex items-center justify-center w-10 h-9 bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white disabled:opacity-30 disabled:hover:bg-blue-600/10 rounded-lg transition-all"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
}
