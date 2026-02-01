import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { Message } from "@/types";
import { format } from "date-fns";
import { MessageAttachments } from "./MessageAttachments";
import { MessageSquare, Reply } from "lucide-react"; // Using Lucide for icons
import { ThreadModal } from "./ThreadModal";

export function MessageBubble({
  message,
  projectId,
}: {
  message: Message;
  projectId: string;
}) {
  const { user } = useAuth();
  const [isThreadOpen, setIsThreadOpen] = useState(false);

  const isOwn = message.senderId === user?.id;
  const time = format(new Date(message.createdAt), "HH:mm");

  return (
    <>
      {/* 1. Added 'group' for hover and 'relative' for positioning */}
      <div
        className={`group relative flex gap-3 p-2 rounded-lg hover:bg-gray-800/30 transition-colors ${isOwn ? "flex-row-reverse" : ""}`}
      >
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0 flex items-center justify-center text-sm font-bold">
          {message.senderName.substring(0, 1).toUpperCase()}
        </div>

        {/* Content Area */}
        <div
          className={`max-w-xl flex flex-col ${isOwn ? "items-end" : "items-start"}`}
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">
              {isOwn ? "You" : message.senderName}
            </span>
            <span className="text-xs text-gray-400">{time}</span>
          </div>

          {/* Text bubble */}
          {message.text && (
            <div
              className={`
                mt-1 px-4 py-2 rounded-lg whitespace-pre-wrap leading-relaxed shadow-sm
                ${isOwn ? "bg-blue-600 text-white" : "bg-[#2A2D31] text-gray-200"}
              `}
            >
              {message.text}
            </div>
          )}

          {/* Attachments */}
          {message.attachments?.length > 0 && (
            <div className="mt-2">
              <MessageAttachments attachments={message.attachments} />
            </div>
          )}

          {/* Thread Link (Static) */}
          {message.hasReplies && (
            <button
              onClick={() => setIsThreadOpen(true)}
              className="mt-1 text-xs text-blue-400 hover:underline flex items-center gap-1 font-medium"
            >
              <MessageSquare size={12} />
              View thread
            </button>
          )}
        </div>

        {/* 2. Hover Action Bar - Adjusted Positioning */}
        <div
          className={`
          absolute -top-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200
          flex bg-[#1A1D21] border border-gray-600 rounded-md shadow-xl
          ${isOwn ? "left-4" : "right-4"} 
        `}
        >
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering other clicks
              setIsThreadOpen(true);
            }}
            className="p-2 hover:bg-gray-700 text-gray-300 rounded-md flex items-center gap-2 text-xs font-medium"
            title="Reply to thread"
          >
            <Reply size={16} />
            <span className="pr-1">Reply</span>
          </button>
        </div>
      </div>

      {/* Modal logic remains the same */}
      {isThreadOpen && (
        <ThreadModal
          projectId={projectId}
          parentMessage={message}
          onClose={() => setIsThreadOpen(false)}
        />
      )}
    </>
  );
}
