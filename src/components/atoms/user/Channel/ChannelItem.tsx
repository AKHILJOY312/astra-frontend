import { Hash, Lock, Settings } from "lucide-react";
import type { Channel } from "@/types";

interface ChannelItemProps {
  channel: Channel;
  isActive: boolean;
  isManager: boolean;
  onClick: (ch: Channel) => void;
  onEdit: (ch: Channel) => void;
}

export const ChannelItem = ({
  channel,
  isActive,
  isManager,
  onClick,
  onEdit,
}: ChannelItemProps) => (
  <div className="relative group">
    <button
      onClick={() => onClick(channel)}
      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all ${
        isActive
          ? "bg-white/10 text-white font-medium"
          : "text-gray-400 hover:text-white hover:bg-white/5"
      }`}
    >
      {channel.unreadCount ? (
        <Lock className="w-4 h-4 shrink-0" />
      ) : (
        <Hash className="w-4 h-4 shrink-0" />
      )}
      <span className="truncate text-sm flex-1">{channel.channelName}</span>
    </button>

    {isManager && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit(channel);
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-white/20 transition-all"
      >
        <Settings className="w-4 h-4 text-gray-400 hover:text-white" />
      </button>
    )}
  </div>
);
