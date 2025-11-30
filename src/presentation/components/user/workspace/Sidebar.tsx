"use client"; // Remove this line if not using Next.js App Router

import { useState } from "react";
import {
  Home,
  MessagesSquare,
  Bell,
  MoreHorizontal,
  Plus,
  ChevronDown,
  LogOut,
  Settings,
  Hash,
  Globe,
} from "lucide-react";

// Helper to clsx-like class merging
const cn = (...inputs: (string | undefined | false)[]) =>
  inputs.filter(Boolean).join(" ");

export default function SlackSidebar() {
  const [activeItem, setActiveItem] = useState("home");

  // Mock user
  const user = { name: "John Doe", image: "", initials: "JD" };

  return (
    <aside className="flex h-screen w-[70px] flex-col items-center gap-y-4 bg-[#381349] pb-2 pt-3">
      {/* Workspace Switcher */}
      <div className="group relative">
        <button className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#4F1B60] transition-all hover:rounded-xl hover:bg-[#6b2a85]">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-white text-xl font-bold text-[#381349]">
            A
          </div>
        </button>

        {/* Hover tooltip */}
        <div className="pointer-events-none absolute left-full top-0 ml-2 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
          Acme Corp
          <div className="absolute left-[-4px] top-3 border-4 border-transparent border-r-black" />
        </div>

        {/* Optional dropdown indicator */}
        <ChevronDown className="absolute -bottom-1 right-0 h-4 w-4 rounded-full bg-[#381349] text-white opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      <div className="h-px w-8 bg-white/20" />

      {/* Navigation Items */}
      <SidebarButton
        icon={Home}
        label="Home"
        isActive={activeItem === "home"}
        onClick={() => setActiveItem("home")}
      />
      <SidebarButton
        icon={MessagesSquare}
        label="DMs"
        isActive={activeItem === "dms"}
        onClick={() => setActiveItem("dms")}
      />
      <SidebarButton
        icon={Bell}
        label="Activity"
        isActive={activeItem === "activity"}
        onClick={() => setActiveItem("activity")}
      />
      <SidebarButton
        icon={Hash}
        label="Channels"
        isActive={activeItem === "channels"}
        onClick={() => setActiveItem("channels")}
      />

      {/* New Message Button */}
      <div className="mt-2">
        <button className="group flex h-12 w-12 items-center justify-center rounded-lg bg-transparent transition-all hover:rounded-xl hover:bg-white/10">
          <Plus className="h-6 w-6 text-white/70 transition-all group-hover:scale-110 group-hover:text-white" />
        </button>
        <span className="mt-1 block text-[11px] text-white/70">New</span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* User Button */}
      <div className="group relative mb-2">
        <button className="flex h-12 w-12 items-center justify-center rounded-lg transition-all hover:rounded-xl hover:bg-white/10">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 text-white font-bold">
              {user.initials || user.name[0]}
            </div>
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#381349] bg-green-500" />
          </div>
        </button>

        {/* Tooltip */}
        <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white opacity0 transition-opacity group-hover:opacity-100">
          {user.name}
          <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-black" />
        </div>
      </div>
    </aside>
  );
}

// Reusable Sidebar Button Component (same style as your reference)
interface SidebarButtonProps {
  icon: any;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

function SidebarButton({
  icon: Icon,
  label,
  isActive,
  onClick,
}: SidebarButtonProps) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center justify-center gap-y-0.5"
    >
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg p-2 transition-all",
          isActive
            ? "bg-white/20"
            : "bg-transparent hover:rounded-xl hover:bg-white/10"
        )}
      >
        <Icon
          className={cn(
            "h-5 w-5 text-white transition-all group-hover:scale-110",
            isActive && "scale-110"
          )}
        />
      </div>
      <span
        className={cn(
          "text-[11px] transition-colors",
          isActive ? "text-white" : "text-white/70 group-hover:text-white"
        )}
      >
        {label}
      </span>
    </button>
  );
}
