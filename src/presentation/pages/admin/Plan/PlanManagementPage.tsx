// app/admin/plans/page.tsx
import PageBreadcrumb from "@/presentation/components/admin/common/PageBreadCrumb";
import ComponentCard from "@/presentation/components/admin/common/ComponentCard";
import PageMeta from "@/presentation/components/admin/common/PageMeta";
import PlanList from "@/presentation/components/admin/plan/PlanList";
import AddPlanButton from "@/presentation/components/admin/plan/AddPlanButton";

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
