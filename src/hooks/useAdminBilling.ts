// hooks/useAdminBilling.ts
import { useState, useCallback } from "react";
import {
  fetchAdminDashboardApi,
  fetchBillDetailsApi,
  fetchBillingListApi,
} from "@/services/adminBillingService";

import type {
  BillingListResponse,
  BillingQueryParams,
  AdminDashboardResponse,
} from "@/types/adminBilling.types";

export function useAdminBilling() {
  const [billing, setBilling] = useState<BillingListResponse | null>(null);
  const [dashboard, setDashboard] = useState<AdminDashboardResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---- Billing list (params passed here, not stored) ----
  const fetchBillingList = useCallback(async (params: BillingQueryParams) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetchBillingListApi(params);
      setBilling(res.data.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message); // Now TS knows this is safe
      }
      setError("Failed to fetch billing list");
    } finally {
      setLoading(false);
    }
  }, []);
  // ---- Single user billing ----
  const fetchBillDetails = useCallback(async (userId: string) => {
    return fetchBillDetailsApi({ userId });
  }, []);
  // ---- Dashboard ----
  const fetchDashboard = useCallback(async () => {
    try {
      const res = await fetchAdminDashboardApi();
      setDashboard(res.data.data);
    } catch {
      setError("Failed to fetch dashboard");
    }
  }, []);

  return {
    billing,
    dashboard,
    loading,
    error,
    fetchBillingList,
    fetchDashboard,
    fetchBillDetails,
  };
}
