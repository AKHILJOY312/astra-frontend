import { Outlet } from "react-router-dom";
import Sidebar from "../workspace/Sidebar";
import UpgradePlanModal from "../common/UpgradePlanModal";
import { PlanLimitBanner } from "../common/PlanLimitBanner";
import InviteMemberModal from "../common/InviteMemberModal";
import Header from "../workspace/Header";
export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#2b2c3a] text-white overflow-hidden">
      {/* 1. Slack-style Left Sidebar (70px purple) */}
      <Sidebar />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Slack Header (fixed top bar) */}
        <Header />

        {/* Page Content (messages, boards, etc.) */}
        <main className="flex-1 overflow-y-auto bg-[#36393f]">
          {/* This is where your routed pages will render */}
          {children}

          {/* Optional: fallback when no route matches */}
          {/* <div className="p-8 text-center text-gray-400">
            Select a channel or conversation
          </div> */}
        </main>
      </div>

      {/* Your existing global modals & banners */}
      <UpgradePlanModal />
      <PlanLimitBanner />
      <InviteMemberModal />
    </div>
  );
}
