import { useEffect, useRef, useState } from "react";
import {
  Home,
  Bell,
  // MoreHorizontal,
  // Plus,
  ChevronDown,
  LogOut,
  Settings,
  // Hash,
  type LucideIcon,
  VideoIcon,
  // Globe,
} from "lucide-react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store/store";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/redux/thunk/authThunks";
import { useAuth } from "@/hooks/useAuth";
import { PATHS } from "@/routes/routeConstant";

// Helper to clsx-like class merging
const cn = (...inputs: (string | undefined | false)[]) =>
  inputs.filter(Boolean).join(" ");

export default function SlackSidebar() {
  const [activeItem, setActiveItem] = useState("home");
  const [showDropdown, setShowDropdown] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const userData = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    dispatch(logoutUser());
    navigate(PATHS.AUTH.LOGIN);
  }
  function getInitials(name?: string): string {
    if (!name) return "";

    const parts = name.trim().split(" ");

    // If only one name → take first 2 letters
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    // If full name → take first letter of first & last word
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  const user = {
    name: userData.user?.name || "",
    image: userData.user?.avatarUrl || "",
    initials: getInitials(userData.user?.name),
    email: userData.user?.email,
  };

  return (
    <aside className="flex h-screen w-[70px] flex-col items-center gap-y-4 bg-[#381349] pb-2 pt-3">
      {/* project Switcher */}
      <div className="group relative">
        <button className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#4F1B60] transition-all hover:rounded-xl hover:bg-[#6b2a85]">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-white text-xl font-bold text-[#381349]">
            A
          </div>
        </button>

        {/* Hover tooltip */}
        <div className="pointer-events-none absolute left-full top-0 ml-2 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
          Acme Corp
          <div className="absolute -left-1 top-3 border-4 border-transparent border-r-black" />
        </div>

        {/* Optional dropdown indicator */}
        <ChevronDown className="absolute -bottom-1 right-0 h-4 w-4 rounded-full bg-[#381349] text-white opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      <div className="h-px w-8 bg-white/20" />

      {/* Navigation Items */}
      <SidebarButton
        icon={Home}
        label="Projects"
        isActive={activeItem === "home"}
        onClick={() => setActiveItem("home")}
        route={PATHS.PROJECT.DASHBOARD}
      />
      <SidebarButton
        icon={VideoIcon}
        label="Meetings"
        isActive={activeItem === "dms"}
        onClick={() => setActiveItem("dms")}
        route={PATHS.VIDEO.PAGE}
      />
      <SidebarButton
        icon={Bell}
        label="Activity"
        isActive={activeItem === "activity"}
        onClick={() => setActiveItem("activity")}
        route={PATHS.TASK.PAGE}
      />
      {/* <SidebarButton
        icon={Hash}
        label="Channels"
        isActive={activeItem === "channels"}
        onClick={() => setActiveItem("channels")}
      /> */}

      {/* New Message Button */}
      {/* <div className="mt-2">
        <button className="group flex h-12 w-12 items-center justify-center rounded-lg bg-transparent transition-all hover:rounded-xl hover:bg-white/10">
          <Plus className="h-6 w-6 text-white/70 transition-all group-hover:scale-110 group-hover:text-white" />
        </button>
        <span className="mt-1 block text-[11px] text-white/70">New</span>
      </div> */}

      {/* Spacer */}
      <div className="flex-1" />

      {/* USER AVATAR + DROPDOWN – Fixed to stay inside screen */}
      <div ref={dropdownRef} className="relative mb-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowDropdown((prev) => !prev);
          }}
          className="flex h-12 w-12 items-center justify-center rounded-lg transition-all hover:rounded-xl hover:bg-white/10"
        >
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-full overflow-hidden bg-linear-to-br from-emerald-400 to-teal-600 text-lg font-bold text-white">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name ?? "User avatar"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{user.initials}</span>
              )}
            </div>

            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#381349] bg-green-500" />
          </div>
        </button>

        {/* Tooltip (still centered) */}
        <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
          {user.name}
          <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-black" />
        </div>

        {/* DROPDOWN – Now aligned to the RIGHT edge of the sidebar */}
        {showDropdown && (
          <div className="absolute bottom-full left-full mb-4 ml-2 w-64 -translate-y-2 rounded-lg bg-[#2f2f2f] shadow-2xl ring-1 ring-white/10 z-50">
            <div className="p-3">
              {/* User info */}
              <div className="flex items-center gap-3 rounded-lg p-3 hover:bg-white/10">
                <div className="relative shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full overflow-hidden bg-linear-to-br from-emerald-400 to-teal-600 text-xl font-bold text-white">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>{user.initials}</span>
                    )}
                  </div>

                  <div className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-[#2f2f2f] bg-green-500" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    {user.name}
                  </p>
                  <p className="text-xs text-green-400">{user.email}</p>
                </div>
              </div>

              <div className="my-2 h-px bg-white/10" />

              <button
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-white/90 transition hover:bg-white/10"
                onClick={() => navigate("/user/profile")}
              >
                <Settings className="h-4 w-4" />
                Profile & account
              </button>

              <button
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-white/90 transition hover:bg-white/10"
                onClick={() => handleLogout()}
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>

            {/* Arrow pointer – now points from the left */}
            <div className="absolute bottom-0 left-0 -mb-2 ml-6 border-8 border-transparent border-t-[#2f2f2f]" />
          </div>
        )}
      </div>
    </aside>
  );
}

// Reusable Sidebar Button Component (same style as your reference)
interface SidebarButtonProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  route?: string;
}

function SidebarButton({
  icon: Icon,
  label,
  isActive,
  onClick,
  route,
}: SidebarButtonProps) {
  const navigate = useNavigate();

  function handleClick() {
    if (route) navigate(route);
    if (onClick) onClick();
  }
  return (
    <button
      onClick={handleClick}
      className="group flex flex-col items-center justify-center gap-y-0.5"
    >
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg p-2 transition-all",
          isActive
            ? "bg-white/20"
            : "bg-transparent hover:rounded-xl hover:bg-white/10",
        )}
      >
        <Icon
          className={cn(
            "h-5 w-5 text-white transition-all group-hover:scale-110",
            isActive && "scale-110",
          )}
        />
      </div>
      <span
        className={cn(
          "text-[11px] transition-colors",
          isActive ? "text-white" : "text-white/70 group-hover:text-white",
        )}
      >
        {label}
      </span>
    </button>
  );
}
