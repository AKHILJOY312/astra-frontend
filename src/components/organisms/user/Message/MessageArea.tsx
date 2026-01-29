import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useMessages } from "@/hooks/useMessages";
import { useChannels } from "@/hooks/useChannels";

import type { Message } from "@/types";

import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";

interface Props {
  channelId: string;
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
    isFetching,
  }: {
    messages: Message[];
    activeChannelId: string | null;
    scrollRef: React.RefObject<HTMLDivElement>;
    loadOlderMessages: () => void;
    isFetching: boolean;
  } = useMessages(projectId ?? null, channelId, channels);

  const isLoading = isFetching && activeChannelId === channelId;

  // Auto-scroll on new messages
  useEffect(() => {
    const view = scrollRef.current;
    if (!view) return;

    view.scrollTo({
      top: view.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, scrollRef]);

  return (
    <div className="flex flex-col flex-1 overflow-hidden h-full bg-[#1A1D21] text-gray-100">
      {/* Slack Message List */}
      <MessageList
        scrollRef={scrollRef}
        isLoading={isLoading}
        messages={messages}
        loadOlderMessages={loadOlderMessages}
      />

      {/* Slack Input */}
      <MessageInput channelId={channelId} projectId={projectId} />
    </div>
  );
}
