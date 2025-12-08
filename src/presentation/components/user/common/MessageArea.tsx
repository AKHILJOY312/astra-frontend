import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useMessages } from "@/presentation/hooks/useMessages";
import { messageGateway } from "@/data/gateway/MessageGateway";
import { useChannels } from "@/presentation/hooks/useChannels";
import { useAuth } from "@/presentation/hooks/useAuth";
import { format } from "date-fns";
import type { Message } from "@/domain/entities/message/Message";

interface Props {
  channelId: string;
}
interface SlackMessageListProps {
  scrollRef: React.RefObject<HTMLDivElement>;
  isLoading: boolean;
  messages: Message[];
  loadOlderMessages: () => void;
}
/* ------------------------------------------------------
   MAIN SLACK MESSAGE AREA (WRAPPER)
------------------------------------------------------ */
export default function MessageArea({ channelId }: Props) {
  const { projectId } = useParams<{ projectId: string }>();
  const { channels } = useChannels(projectId!);
  const {
    messages,
    activeChannelId,
    scrollRef,
    loadOlderMessages,
  }: {
    messages: Message[];
    activeChannelId: string | null;
    scrollRef: React.RefObject<HTMLDivElement>;
    loadOlderMessages: () => void;
  } = useMessages(projectId ?? null, channelId, channels);

  const isLoading = !messages.length && activeChannelId === channelId;

  // Auto-scroll on new messages
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollTo({
      top: el.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="flex flex-col flex-1 overflow-hidden h-full pt-8 bg-[#1A1D21] text-gray-100">
      {/* Slack Message List */}
      <SlackMessageList
        scrollRef={scrollRef}
        isLoading={isLoading}
        messages={messages}
        loadOlderMessages={loadOlderMessages}
      />

      {/* Slack Input */}
      <SlackMessageInput channelId={channelId} projectId={projectId} />
    </div>
  );
}

/* ------------------------------------------------------
   SLACK MESSAGE LIST
------------------------------------------------------ */
function SlackMessageList({
  scrollRef,
  isLoading,
  messages,
  loadOlderMessages,
}: SlackMessageListProps) {
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
          <SlackMessageBubble key={msg.id} message={msg} />
        ))
      )}
    </div>
  );
}

/* ------------------------------------------------------
   SLACK MESSAGE INPUT
------------------------------------------------------ */

interface MessageInputProps {
  channelId: string;
  projectId: string | undefined;
}

function SlackMessageInput({ channelId, projectId }: MessageInputProps) {
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;

    messageGateway.sendMessage({
      text: text.trim(),
      channelId,
      projectId,
    });

    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="border-t border-[#2A2D31] p-4 bg-[#1A1D21]">
      <div className="flex items-center gap-3 bg-[#2A2D31] rounded-xl px-4 py-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message in this channel"
          className="flex-1 bg-transparent text-gray-100 outline-none"
        />

        <button
          onClick={send}
          disabled={!text.trim()}
          className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-40"
        >
          Send
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------
   SLACK MESSAGE BUBBLE
------------------------------------------------------ */
function SlackMessageBubble({ message }: { message: Message }) {
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

        <div
          className={`
            mt-1 px-4 py-2 rounded-lg whitespace-pre-wrap leading-relaxed 
            ${isOwn ? "bg-blue-600 text-white" : "bg-[#2A2D31] text-gray-200"}
          `}
        >
          {message.text}
        </div>

        {/* Attachment Indicator */}
        {message.hasAttachments && (
          <div className="text-xs text-gray-400 mt-2">📎 Attachment</div>
        )}
      </div>
    </div>
  );
}
