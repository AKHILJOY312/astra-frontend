import React, { useEffect, useState } from "react";

import { useAdminBilling } from "@/hooks/useAdminBilling";
import type {
  BillingQueryParams,
  BillingUserOverview,
} from "@/types/adminBilling.types";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/atoms/admin/table";
import { SearchBar } from "@/components/organisms/admin/tables/BasicTables/SearchBar";
import Badge from "@/components/atoms/admin/badge/Badge";
import BillingPaginationFooter from "./BillingPaginationFooter";

const AdminBillingList: React.FC = () => {
  const { billing, loading, error, fetchBillingList } = useAdminBilling();

  const [listState, setListState] = useState<BillingQueryParams>({
    page: 1,
    limit: 10,
    search: "",
  });

  const { page, limit, search } = listState;

  // Fetch only when query params change
  useEffect(() => {
    fetchBillingList({ page, limit, search });
  }, [fetchBillingList, page, limit, search]);

  const handleSearchChange = (value: string) => {
    setListState((prev) => ({
      ...prev,
      page: 1,
      search: value,
    }));
  };

  const handlePageChange = (nextPage: number) => {
    setListState((prev) => ({
      ...prev,
      page: nextPage,
    }));
  };

  const users: BillingUserOverview[] = billing?.users ?? [];
  const totalUsers = billing?.totalUsers ?? 0;
  const totalPages = Math.ceil(totalUsers / limit);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
      <SearchBar onSearchChange={handleSearchChange} isLoading={loading} />

      {error && (
        <div className="p-4 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/5">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 text-start">
                User
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start">
                Email
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start">
                Plan
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start">
                Status
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-end">
                Total Spent
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
            {users.map((user) => (
              <TableRow key={user.userId}>
                <TableCell className="px-5 py-4 text-start">
                  {user.userName}
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 dark:text-gray-400">
                  {user.userEmail}
                </TableCell>

                <TableCell className="px-4 py-3">
                  <Badge size="sm" color="info">
                    {user.planName}
                  </Badge>
                </TableCell>

                <TableCell className="px-4 py-3">
                  <Badge
                    size="sm"
                    color={
                      user.subscriptionStatus === "active" ? "success" : "error"
                    }
                  >
                    {user.subscriptionStatus}
                  </Badge>
                </TableCell>

                <TableCell className="px-5 py-4 text-end font-medium">
                  ₹{user.totalSpent.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <BillingPaginationFooter
        page={page}
        totalPages={totalPages}
        totalUsers={totalUsers}
        currentCount={users.length}
        loading={loading}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default AdminBillingList;
