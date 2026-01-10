/* ------------------------------------------------------
   SLACK MESSAGE INPUT
------------------------------------------------------ */

import { messageGateway } from "@/services/gateway/MessageGateway";
import { useState } from "react";
import EmojiPicker, { Theme, type EmojiClickData } from "emoji-picker-react";
import { SmileIcon } from "lucide-react";

interface MessageInputProps {
  channelId: string;
  projectId: string | undefined;
}

export function MessageInput({ channelId, projectId }: MessageInputProps) {
  const [text, setText] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setText((prev) => prev + emojiData.emoji);
    // Optional: hide picker after selection
    // setShowPicker(false);
  };

  const send = () => {
    if (!text.trim()) return;
    messageGateway.sendMessage({
      text: text.trim(),
      channelId,
      projectId,
    });
    setText("");
    setShowPicker(false);
  };

  return (
    <div className="border-t border-[#2A2D31] p-4 bg-[#1A1D21] relative">
      {/* Emoji Picker Popover */}
      {showPicker && (
        <div className="absolute bottom-20 left-4 z-50">
          <EmojiPicker
            theme={Theme.DARK}
            onEmojiClick={onEmojiClick}
            skinTonesDisabled
          />
        </div>
      )}

      <div className="flex items-center gap-3 bg-[#2A2D31] rounded-xl px-4 py-3">
        {/* Emoji Toggle Button */}
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="text-gray-400 hover:text-white transition-colors"
          type="button"
        >
          <SmileIcon />
        </button>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
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
