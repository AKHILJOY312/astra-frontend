import AdminSidebar from "@/components/organisms/admin/AdminSidebar";
import BrandNavbar from "@/components/organisms/admin/Navbar";
import React from "react";
import { Outlet } from "react-router-dom";

const AdminLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex flex-col flex-1">
        <BrandNavbar />
        <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
