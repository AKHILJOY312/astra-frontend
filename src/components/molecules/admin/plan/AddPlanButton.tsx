import Button from "@/components/atoms/admin/button/Button";
import { Plus } from "lucide-react";
import PlanFormDialog from "../../../organisms/admin/plan/PlanFormDialog";
import { useState } from "react";

export default function AddPlanButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm">
        <Plus className="w-4 h-4 mr-1" />
        Add New Plan
      </Button>

      <PlanFormDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
