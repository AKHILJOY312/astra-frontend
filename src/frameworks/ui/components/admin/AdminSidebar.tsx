import React, { useState } from "react";
import { LayoutDashboard, Users, Settings } from "lucide-react";

const AdminSidebar = () => {
  const [activeLink, setActiveLink] = useState("/admin/dashboard");

  const links = [
    {
      to: "/admin/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    { to: "/admin/users", label: "Users", icon: <Users size={18} /> },
    { to: "/admin/settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-[#18216D] to-[#2E186A] text-white flex flex-col shadow-xl">
      <div className="p-6 text-xl font-bold border-b border-white/10">
        <span className="bg-gradient-to-r from-white to-[#FF825C] bg-clip-text text-transparent">
          Admin Panel
        </span>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-3">
        {links.map((link) => (
          <button
            key={link.to}
            onClick={() => setActiveLink(link.to)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
              activeLink === link.to
                ? "bg-[#FF825C] text-white shadow-lg transform scale-105"
                : "hover:bg-white/10 text-[#EDEFF5]"
            }`}
          >
            {link.icon}
            <span className="font-medium">{link.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
