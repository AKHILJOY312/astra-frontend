import {
  Search,
  HelpCircle,
  Bell,
  ChevronDown,
  Mic,
  Headphones,
  Settings,
  Hash,
  MoreVertical,
  Users,
} from "lucide-react";

const cn = (...inputs: (string | undefined | false)[]) =>
  inputs.filter(Boolean).join(" ");

export default function SlackHeader() {
  const currentChannel = {
    name: "general",
    isPrivate: false,
    members: 42,
  };

  const userStatus = "online"; // online, away, dnd

  return (
    <header className="fixed top-0 left-[70px] right-0 z-40 flex h-12 items-center border-b border-white/10 bg-[#4F1B60] px-4 text-white">
      {/* Left: Channel Info */}
      <div className="flex flex-1 items-center gap-3">
        <button className="flex items-center gap-2 hover:bg-white/10 rounded-md px-2 py-1.5 transition">
          <Hash className="h-5 w-5" />
          <span className="text-lg font-semibold">{currentChannel.name}</span>
          <ChevronDown className="h-4 w-4 opacity-70" />
        </button>

        {/* Channel Details (hover to see more) */}
        <div className="hidden items-center gap-4 text-sm opacity-70 md:flex">
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {currentChannel.members}
          </span>
          <span>|</span>
          <span>
            Welcome to the team! This is the very beginning of the #
            {currentChannel.name} channel.
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
          <input
            type="text"
            placeholder="Search in #general"
            className="w-64 rounded-md bg-white/10 py-1.5 pl-10 pr-3 text-sm placeholder-white/50 focus:outline-none focus:bg-white/20 transition"
          />
        </div>

        {/* Help */}
        <button className="p-2 hover:bg-white/10 rounded-md transition">
          <HelpCircle className="h-5 w-5" />
        </button>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-white/10 rounded-md transition">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* Voice / Presence */}
        <div className="flex items-center gap-1">
          <button
            className={cn(
              "p-2 rounded-md transition",
              userStatus === "online" ? "text-red-400" : "hover:bg-white/10"
            )}
          >
            {userStatus === "online" ? (
              <Headphones className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* User Menu */}
        <button className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-white/10 transition">
          <div className="relative">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-sm font-bold">
              JD
            </div>
            <div
              className={cn(
                "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#4F1B60]",
                userStatus === "online" && "bg-green-500"
                //   userStatus === "away" && "bg-yellow-500",
                //   userStatus === "dnd" && "bg-red-500"
              )}
            />
          </div>
          <ChevronDown className="h-4 w-4 opacity-70" />
        </button>
      </div>
    </header>
  );
}
