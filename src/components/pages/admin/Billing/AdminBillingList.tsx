import React, { useEffect, useState } from "react";
import { useAdminBilling } from "@/hooks/useAdminBilling";
import type {
  BillingQueryParams,
  UserBillingDetails,
} from "@/types/adminBilling.types";

import { SearchBar } from "@/components/organisms/admin/tables/BasicTables/SearchBar";
import BillingPaginationFooter from "./BillingPaginationFooter";
import BillingTable from "./BillingTable";
import { Modal } from "@/components/atoms/admin/modal";
import Badge from "@/components/atoms/admin/badge/Badge";

const AdminBillingList: React.FC = () => {
  const { billing, loading, error, fetchBillingList, fetchBillDetails } =
    useAdminBilling();

  const [listState, setListState] = useState<BillingQueryParams>({
    page: 1,
    limit: 10,
    search: "",
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserBillingDetails | null>(
    null,
  );

  const { page, limit, search } = listState;

  useEffect(() => {
    fetchBillingList({ page, limit, search });
  }, [fetchBillingList, page, limit, search]);

  const handleRowClick = async (userId: string) => {
    setIsModalOpen(true);
    setDetailsLoading(true);
    try {
      const response = await fetchBillDetails(userId);
      setSelectedUser(response.data.data);
    } catch (err) {
      console.error("Failed to fetch user details", err);
    } finally {
      setDetailsLoading(false);
    }
  };
  const handleSearchChange = React.useCallback((val: string) => {
    setListState((prev) => ({
      ...prev,
      page: 1,
      search: val,
    }));
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const users = billing?.users ?? [];
  const totalUsers = billing?.totalUsers ?? 0;
  const totalPages = Math.ceil(totalUsers / limit);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
      <SearchBar onSearchChange={handleSearchChange} isLoading={loading} />

      <BillingTable users={users} onRowClick={handleRowClick} />

      <BillingPaginationFooter
        page={page}
        totalPages={totalPages}
        totalUsers={totalUsers}
        currentCount={users.length}
        loading={loading}
        onPageChange={(next) =>
          setListState((prev) => ({ ...prev, page: next }))
        }
      />

      {/* Detail Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} className="max-w-2xl">
        <div className="p-6">
          <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
            User Billing Profile
          </h2>

          {detailsLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : selectedUser ? (
            <div className="space-y-6">
              {/* User Info Section */}
              <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4 dark:bg-white/5">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">
                    User
                  </p>
                  <p className="text-sm font-semibold">
                    {selectedUser.user.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {selectedUser.user.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">
                    Status
                  </p>
                  <Badge
                    size="sm"
                    color={
                      selectedUser.user.status === "active"
                        ? "success"
                        : "error"
                    }
                  >
                    {selectedUser.user.status}
                  </Badge>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-xs text-gray-500">LTV</p>
                  <p className="text-lg font-bold">
                    ₹{selectedUser.stats.ltv.toFixed(2)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Transactions</p>
                  <p className="text-lg font-bold">
                    {selectedUser.stats.totalTransactions}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Failed</p>
                  <p className="text-lg font-bold text-red-500">
                    {selectedUser.stats.failedCount}
                  </p>
                </div>
              </div>

              {/* Payment History Preview */}
              <div>
                <h3 className="mb-3 text-sm font-semibold">
                  Recent Transactions
                </h3>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {selectedUser.paymentHistory.map((payment) => (
                    <div
                      key={payment._id}
                      className="flex items-center justify-between border-b border-gray-100 pb-2 dark:border-white/5 text-sm"
                    >
                      <div>
                        <p className="font-medium">
                          {payment.planName || "One-time Payment"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{payment.amount}</p>
                        <p
                          className={`text-[10px] uppercase ${payment.status === "captured" ? "text-green-500" : "text-orange-500"}`}
                        >
                          {payment.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No data found for this user.
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default AdminBillingList;
