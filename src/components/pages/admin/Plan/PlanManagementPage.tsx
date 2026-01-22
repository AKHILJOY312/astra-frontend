// app/admin/plans/page.tsx
import PageBreadcrumb from "@/components/organisms/admin/common/PageBreadCrumb";
import ComponentCard from "@/components/organisms/admin/common/ComponentCard";
import PageMeta from "@/components/organisms/admin/common/PageMeta";
import PlanList from "@/components/organisms/admin/plan/PlanList";
import AddPlanButton from "@/components/molecules/admin/plan/AddPlanButton";

export default function PlanManagementPage() {
  return (
    <>
      <PageMeta
        title="Plan Management"
        description="Create, Edit and Delete plans"
      />
      <PageBreadcrumb pageTitle="Plans" />

      <div className="space-y-6">
        <ComponentCard title="All Plans" extra={<AddPlanButton />}>
          <PlanList />
        </ComponentCard>
      </div>
    </>
  );
}
