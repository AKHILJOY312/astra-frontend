// import { Outlet } from "react-router-dom";
import Sidebar from "@/components/organisms/user/Workspace/Sidebar";
import UpgradePlanModal from "@/components/organisms/user/common/UpgradePlanModal";
import { PlanLimitBanner } from "@/components/organisms/user/common/PlanLimitBanner";
import InviteMemberModal from "@/components/organisms/user/Projects/InviteMemberModal";
import Header from "@/components/organisms/user/Workspace/Header";
import CreateProjectModal from "@/components/organisms/user/Projects/CreateProjectModal";
import UiAlert from "@/components/atoms/user/Alert/UiAlert";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { hideAlert } from "@/redux/slice/uiSlice";
export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const alert = useAppSelector((state) => state.ui.alert);
  const dispatch = useAppDispatch();
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
      {alert && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
          <UiAlert
            type={alert.type}
            message={alert.message}
            onClose={() => dispatch(hideAlert())}
          />
        </div>
      )}
    </div>
  );
}
