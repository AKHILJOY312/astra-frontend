import ControllerBar from "../common/ControllerBar";

import { Outlet } from "react-router-dom";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <ControllerBar />
      {children}
    </div>
  );
}
