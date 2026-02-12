import PageMeta from "@/components/organisms/admin/common/PageMeta";
import AdminDashboard from "./AdminDashboard";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Dashboard"
        description="View and manage your admin dashboard"
      />

      <AdminDashboard></AdminDashboard>
    </>
  );
}
