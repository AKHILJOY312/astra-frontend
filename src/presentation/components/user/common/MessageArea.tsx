// src/components/slack/MessageArea.tsx
import { useState, useRef, useEffect } from "react";
import {
  Paperclip,
  Smile,
  Send,
  Plus,
  Reply,
  ThumbsUp,
  MoreHorizontal,
} from "lucide-react";

interface Message {
  id: string;
  user: string;
  avatar: string;
  text: string;
  time: string;
}

export default function MessageArea() {
  const [message, setMessage] = useState("");
  const [messages] = useState<Message[]>([
    {
      id: "1",
      user: "Alex Rivera",
      avatar: "A",
      text: "Hey team! Ready for the demo today?",
      time: "10:30 AM",
    },
    {
      id: "2",
      user: "Sarah Chen",
      avatar: "S",
      text: "Yes! I just finalized the Figma prototype. I'll share the link in 5 mins",
      time: "10:32 AM",
    },
  ]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }, [message]);

  const handleSend = () => {
    if (!message.trim()) return;
    // setMessages(...) + API call here
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#36393f]">
      {/* ← THIS LINE FIXED EVERYTHING */}
      <div className="flex-1 overflow-y-auto pt-12">
        {" "}
        {/* ← 48px = header height */}
        <div className="max-w-4xl mx-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="text-center py-32">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 opacity-20" />
              <h2 className="text-2xl font-bold text-white mb-2">#general</h2>
              <p className="text-gray-400">
                This is the very beginning of #general.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="flex-1 h-px bg-gray-700" />
                <span>Today</span>
                <div className="flex-1 h-px bg-gray-700" />
              </div>

              {messages.map((msg, i) => {
                const showAvatar = i === 0 || messages[i - 1].user !== msg.user;

                return (
                  <div
                    key={msg.id}
                    className="group flex gap-3 hover:bg-white/5 px-3 py-2 -mx-3 rounded-lg transition"
                  >
                    {showAvatar ? (
                      <>
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex shrink-0 items-center justify-center text-white font-bold">
                          {msg.avatar}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline gap-2">
                            <span className="font-semibold text-white">
                              {msg.user}
                            </span>
                            <span className="text-xs text-gray-400">
                              {msg.time}
                            </span>
                          </div>
                          <p className="text-gray-100 mt-0.5 break-words">
                            {msg.text}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-10 shrink-0">
                          <span className="text-xs text-gray-500 invisible">
                            00:00
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-gray-100 break-words">
                            {msg.text}
                          </p>
                        </div>
                      </>
                    )}

                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                      <button className="p-1.5 hover:bg-white/10 rounded">
                        <Smile className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-white/10 rounded">
                        <Reply className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-white/10 rounded">
                        <ThumbsUp className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-white/10 rounded">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input — fixed at bottom */}
      <div className="border-t border-white/10">
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-[#40444b] rounded-lg shadow-lg overflow-hidden">
            <div className="flex items-end gap-3 p-3">
              <button className="mb-2 p-2 hover:bg-white/10 rounded-lg transition">
                <Plus className="w-5 h-5 text-gray-400" />
              </button>

              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message #general"
                rows={1}
                className="flex-1 bg-transparent text-white placeholder-gray-400 resize-none outline-none max-h-32 min-h-6"
              />

              <div className="flex items-center gap-1 mb-2">
                <button className="p-2 hover:bg-white/10 rounded-lg transition">
                  <Paperclip className="w-5 h-5 text-gray-400" />
                </button>
                <button className="p-2 hover:bg-white/10 rounded-lg transition">
                  <Smile className="w-5 h-5 text-gray-400" />
                </button>
                {message.trim() ? (
                  <button
                    onClick={handleSend}
                    className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                ) : (
                  <div className="p-2">
                    <Send className="w-5 h-5 text-gray-600" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <p className="mt-2 text-xs text-gray-500 text-center">
            <kbd className="px-1 bg-white/10 rounded">Enter</kbd> to send •{" "}
            <kbd className="px-1 bg-white/10 rounded">Shift + Enter</kbd> for
            new line
          </p>
        </div>
      </div>
    </div>
  );
}
