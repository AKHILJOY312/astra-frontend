import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { fetchReplies } from "@/services/messages.service";
import { messageGateway } from "@/services/gateway/MessageGateway";
import type { Message, MessageReply } from "@/types";
import { format } from "date-fns";
import { Send, X } from "lucide-react";
import { useGsapDrawer } from "@/hooks/useGsapDrawer";

interface ThreadModalProps {
  parentMessage: Message;
  projectId: string;
  onClose: () => void;
}

export function ThreadModal({
  parentMessage,
  projectId,
  onClose,
}: ThreadModalProps) {
  const { user } = useAuth();
  const [replies, setReplies] = useState<MessageReply[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const scrollBottomRef = useRef<HTMLDivElement>(null);
  const { overlayRef, panelRef, animateClose } = useGsapDrawer(true, onClose);

  // 1. Fetch initial replies
  useEffect(() => {
    setLoading(true);
    fetchReplies(projectId, parentMessage.channelId, parentMessage.id)
      .then((res) => {
        setReplies(res.data.data);
      })
      .finally(() => setLoading(false));
  }, [parentMessage.id, projectId]);

  // 2. Listen for real-time replies (Optional: Add a specific socket event if your backend emits one)
  // For now, we'll focus on sending.

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user) return;

    const payload = {
      projectId,
      channelId: parentMessage.channelId,
      parentMessageId: parentMessage.id,
      senderId: user.id,
      text: inputText,
    };

    messageGateway.sendReply(payload);

    // Optimistic UI Update (Optional)
    const optimisticReply: MessageReply = {
      id: Math.random().toString(), // Temp ID
      parentMessageId: parentMessage.id,
      senderId: user.id,
      text: inputText,
      createdAt: new Date().toISOString(),
    };

    setReplies((prev) => [...prev, optimisticReply]);
    setInputText("");

    setTimeout(() => {
      scrollBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex justify-end bg-black/40 backdrop-blur-sm"
    >
      <div
        ref={panelRef}
        className="w-full max-w-md bg-[#1A1D21] h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-[#1A1D21]">
          <div>
            <h3 className="text-white font-bold text-lg">Reply</h3>
            <p className="text-xs text-gray-400">
              with {parentMessage.senderName}
            </p>
          </div>
          <button
            onClick={animateClose}
            className="p-2 hover:bg-gray-700 rounded-full text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Original Message */}
          <div className="flex gap-3 border-b border-gray-800 pb-4">
            <div className="w-9 h-9 rounded bg-blue-700 flex items-center justify-center font-bold text-white">
              {parentMessage.senderName[0].toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">
                  {parentMessage.senderName}
                </span>
                <span className="text-[10px] text-gray-500">
                  {format(new Date(parentMessage.createdAt), "p")}
                </span>
              </div>
              <p className="text-gray-200 mt-1">{parentMessage.text}</p>
            </div>
          </div>

          {/* Replies List */}
          <div className="space-y-4">
            {loading ? (
              <p className="text-gray-500 text-sm text-center">
                Loading replies...
              </p>
            ) : (
              replies.map((reply) => (
                <div key={reply.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center text-xs font-bold text-white">
                    {/* If you have senderName in Reply type, use it here */}R
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">
                        {reply.senderId === user?.id ? "You" : "Member"}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {format(new Date(reply.createdAt), "p")}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">{reply.text}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={scrollBottomRef} />
          </div>
        </div>

        {/* Reply Input */}
        <div className="p-4 border-t border-gray-700 bg-[#1A1D21]">
          <form onSubmit={handleSendReply} className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Reply..."
              className="w-full bg-[#222529] text-white border border-gray-600 rounded-lg p-3 pr-12 focus:outline-none focus:border-blue-500 resize-none"
              rows={3}
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="absolute bottom-3 right-3 p-2 text-blue-500 hover:bg-blue-500/10 rounded-md disabled:opacity-30"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
