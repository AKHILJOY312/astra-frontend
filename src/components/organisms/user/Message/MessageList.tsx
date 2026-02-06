import type { Message } from "@/types";
import { MessageBubble } from "./MessageBubble";

/* ------------------------------------------------------
   SLACK MESSAGE LIST
------------------------------------------------------ */
interface MessageListProps {
  scrollRef: React.RefObject<HTMLDivElement>;
  isLoading: boolean;
  messages: Message[];
  projectId: string;
  loadOlderMessages: () => void;
}
export function MessageList({
  scrollRef,
  isLoading,
  messages,
  projectId,
  loadOlderMessages,
}: MessageListProps) {
  return (
    <div
      ref={scrollRef}
      onScroll={(e) => {
        const el = e.currentTarget;
        if (el.scrollTop === 0) loadOlderMessages();
      }}
      className="flex-1 overflow-y-auto min-h-0 px-6 py-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
    >
      {isLoading ? (
        <div className="text-center text-gray-400">Loading messages...</div>
      ) : messages.length === 0 ? (
        <div className="text-center text-gray-400">No messages yet.</div>
      ) : (
        messages.map((msg: Message) => (
          <MessageBubble key={msg.id} message={msg} projectId={projectId} />
        ))
      )}
    </div>
  );
}
