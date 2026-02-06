import React from "react";
import type { BillingUserOverview } from "@/types/adminBilling.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/atoms/admin/table";
import Badge from "@/components/atoms/admin/badge/Badge";

interface BillingTableProps {
  users: BillingUserOverview[];
  onRowClick: (userId: string) => void;
}

const BillingTable: React.FC<BillingTableProps> = ({ users, onRowClick }) => {
  return (
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
            <TableRow
              key={user.userId}
              onClick={() => onRowClick(user.userId)}
              className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
            >
              <TableCell className="px-5 py-4 text-start font-medium text-gray-900 dark:text-white">
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
  );
};

export default BillingTable;
