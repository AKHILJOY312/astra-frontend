import PageBreadcrumb from "@/components/organisms/admin/common/PageBreadCrumb";
import ComponentCard from "@/components/organisms/admin/common/ComponentCard";
import PageMeta from "@/components/organisms/admin/common/PageMeta";
import UsersList from "@/components/organisms/admin/tables/BasicTables/UsersList";

export default function BasicTables() {
  return (
    <>
      <PageMeta
        title="Users Management | Admin can manage all users"
        description="Admin can manage all users"
      />
      <PageBreadcrumb pageTitle="User Management" />
      <div className="space-y-6">
        <ComponentCard title="List">
          <UsersList />
        </ComponentCard>
      </div>
    </>
  );
}
