// import { Outlet } from "react-router-dom";
import Sidebar from "@/components/organisms/user/Workspace/Sidebar";
import UpgradePlanModal from "@/components/organisms/user/common/UpgradePlanModal";
import { PlanLimitBanner } from "@/components/organisms/user/common/PlanLimitBanner";
import InviteMemberModal from "@/components/organisms/user/Projects/InviteMemberModal";
import Header from "@/components/organisms/user/Workspace/Header";
import CreateProjectModal from "@/components/organisms/user/Projects/CreateProjectModal";
export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#2b2c3a] text-white overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 overflow-y-auto bg-[#36393f]">{children}</main>
      </div>

      {/* Your existing global modals & banners */}
      <CreateProjectModal></CreateProjectModal>
      <UpgradePlanModal />
      <PlanLimitBanner />
      <InviteMemberModal />
    </div>
  );
}
