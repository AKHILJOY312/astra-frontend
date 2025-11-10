import React from "react";
import UserSidebar from "../components/Sidebar/UserSidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const UserLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      <UserSidebar />
      <div className="flex flex-col flex-1">
        <Navbar title="User Dashboard" />
        <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
