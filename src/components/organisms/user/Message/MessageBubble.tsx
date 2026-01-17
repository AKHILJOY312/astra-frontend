import { useAuth } from "@/hooks/useAuth";
import type { Message } from "@/types";
import { format } from "date-fns";
import { MessageAttachments } from "./MessageAttachments";

/* ------------------------------------------------------
   SLACK MESSAGE BUBBLE
------------------------------------------------------ */
export function MessageBubble({ message }: { message: Message }) {
  const { user } = useAuth();
  const isOwn = message.senderId === user?.id;
  const time = format(new Date(message.createdAt), "HH:mm");

  return (
    <div className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold">
        {message.senderName.substring(0, 1).toUpperCase()}
      </div>

      {/* Content */}
      <div className="max-w-xl">
        <div className="flex items-center gap-2">
          <span className="font-semibold">
            {isOwn ? "You" : message.senderName}
          </span>
          <span className="text-xs text-gray-400">{time}</span>
        </div>

        {/* Text bubble */}
        {message.text && (
          <div
            className={`
              mt-1 px-4 py-2 rounded-lg whitespace-pre-wrap leading-relaxed
              ${isOwn ? "bg-blue-600 text-white" : "bg-[#2A2D31] text-gray-200"}
            `}
          >
            {message.text}
          </div>
        )}

        {/* Attachments */}
        {message.attachments?.length > 0 && (
          <MessageAttachments attachments={message.attachments} />
        )}
      </div>
    </div>
  );
}
