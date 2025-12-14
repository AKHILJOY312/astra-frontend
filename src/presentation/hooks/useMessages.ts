import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  setActiveChannel,
  setMessages,
  addMessage,
  clearTextMessages,
  prependOldMessages,
} from "../redux/slice/messageSlice";
import { messageGateway } from "@/data/gateway/MessageGateway";
import api from "@/lib/apicaller";
import type { Channel } from "@/domain/entities/channel/Channel";

export function useMessages(
  projectId: string | null,
  channelId: string | null,
  channels: Channel[]
) {
  const dispatch = useAppDispatch();
  const messages = useAppSelector((state) => state.messages.list);
  const activeChannelId = useAppSelector(
    (state) => state.messages.activeChannelId
  );
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const channelExists = channels.some((c) => c.id === channelId);

  // Clear when project changes
  useEffect(() => {
    dispatch(clearTextMessages());
    setCursor(null);
    setHasMore(true);
  }, [projectId]);

  // Main logic
  useEffect(() => {
    if (!projectId || !channelId || !channelExists) return;

    dispatch(clearTextMessages());
    dispatch(setActiveChannel(channelId));
    setIsFetching(true);
    api
      .get(`/projects/${projectId}/channels/${channelId}/messages?limit=20`)
      .then((res) => {
        const data = res.data.data;
        setIsFetching(false);
        dispatch(setMessages(data));

        // store next cursor
        if (data.length > 0) {
          setCursor(data[0].createdAt);
        } else {
          setHasMore(false);
        }

        // 🔥 Scroll to bottom on first load
        setTimeout(() => {
          scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "instant",
          });
        }, 20);
      });

    messageGateway.joinChannel(channelId);

    const unsubscribe = messageGateway.subscribeToNewMessages((msg) => {
      if (msg.channelId === channelId) {
        dispatch(addMessage(msg));

        // auto-scroll only if user at bottom
        setTimeout(() => {
          const el = scrollRef.current;
          if (!el) return;

          const atBottom =
            el.scrollHeight - el.scrollTop - el.clientHeight < 50;
          if (atBottom) {
            el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
          }
        }, 10);
      }
    });

    return () => {
      unsubscribe?.();
      messageGateway.leaveChannel?.(channelId);
    };
  }, [channelId, channelExists, projectId]);

  const loadOlderMessages = async () => {
    if (!cursor || !hasMore) return;

    const res = await api.get(
      `/projects/${projectId}/channels/${channelId}/messages?cursor=${cursor}&limit=20`
    );

    const data = res.data.data;
    if (data.length === 0) {
      setHasMore(false);
      return;
    }
    //  Save old scroll position before adding
    const el = scrollRef.current;
    if (!el) return;
    const prevHeight = el.scrollHeight;

    dispatch(prependOldMessages(data));

    // update cursor
    setCursor(data[0].createdAt);

    //  Maintain scroll position after prepending
    setTimeout(() => {
      const newHeight = el.scrollHeight;
      el.scrollTop = newHeight - prevHeight;
    }, 10);
  };
  return {
    messages,
    activeChannelId,
    scrollRef,
    loadOlderMessages,
    isFetching,
  };
}
