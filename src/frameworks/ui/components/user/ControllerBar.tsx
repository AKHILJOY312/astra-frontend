// src/components/user/ControllerBar.tsx
"use client";

import { useState, useRef, useEffect } from "react";

import {
  MessageCircle,
  Circle,
  Radio,
  Users,
  Settings,
  LogOut,
  User as UserIcon,
  Sparkles,
} from "lucide-react";

import { useDispatch } from "react-redux";
import { logoutUser } from "@/frameworks/ui/redux/slices/authSlice";
import type { AppDispatch } from "@/frameworks/ui/redux/store";
import { useNavigate } from "react-router-dom";

export default function ControllerBar() {
  const [activeTab, setActiveTab] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { label: "Chats", icon: <MessageCircle className="w-6 h-6" /> },
    { label: "Status", icon: <Circle className="w-6 h-6" /> },
    { label: "Channels", icon: <Radio className="w-6 h-6" /> },
    { label: "Communities", icon: <Users className="w-8 h-8" /> },

    { label: "Settings", icon: <Settings className="w-6 h-6" /> },
  ];

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  const profileMenuItems = [
    {
      label: "Profile",
      icon: <UserIcon className="w-5 h-5" />,
      onClick: () => alert("Profile"),
    },
    {
      label: "Settings",
      icon: <Settings className="w-5 h-5" />,
      onClick: () => alert("Settings"),
    },
    {
      label: "Logout",
      icon: <LogOut className="w-5 h-5" />,
      onClick: () => handleLogout(),
    },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-20 bg-gray-50 border-r border-gray-200 flex flex-col items-center py-4 gap-6 z-50">
      {/* ───── Top icons ───── */}
      <div className="flex flex-col gap-4">
        {navItems.map((item, idx) => (
          <button
            key={idx}
            aria-label={item.label}
            aria-pressed={activeTab === idx}
            onClick={() => setActiveTab(idx)}
            className={`p-3 rounded-xl transition-all ${
              activeTab === idx
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            {item.icon}
          </button>
        ))}
      </div>

      <hr className="w-10 border-t border-gray-300" />

      {/* ───── Profile button + pop‑up ───── */}
      <div className="mt-auto relative" ref={menuRef}>
        {/* Profile button */}
        <button
          aria-label="Profile"
          onClick={() => setShowProfileMenu((v) => !v)}
          className={`p-3 rounded-xl transition-all ${
            showProfileMenu
              ? "bg-blue-100 text-blue-600"
              : "text-gray-600 hover:bg-gray-200"
          }`}
        >
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-300">
            <img
              src="https://media-maa2-1.cdn.whatsapp.net/v/t61.24694-24/473399454_1321697788817944_4997064142698727504_n.jpg?stp=dst-jpg_s96x96_tt6&ccb=11-4&oh=01_Q5Aa3AHpnHgGoKmZ2Z8xiOiq47yOE641BNkvf9VveID5Y72cFQ&oe=691FD351&_nc_sid=5e03e0&_nc_cat=101"
              alt="Profile"
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>
        </button>

        {/* Pop‑up menu – sticks to the right of the button */}
        {showProfileMenu && (
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
            <div className="p-2">
              {profileMenuItems.map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    item.onClick();
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-left text-sm text-gray-800"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
