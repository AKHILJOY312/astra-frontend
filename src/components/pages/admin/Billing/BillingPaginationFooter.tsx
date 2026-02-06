import React from "react";
import Button from "@/components/atoms/admin/button/Button";

type BillingPaginationFooterProps = {
  page: number;
  totalPages: number;
  totalUsers: number;
  currentCount: number;
  loading: boolean;
  onPageChange: (page: number) => void;
};

const BillingPaginationFooter: React.FC<BillingPaginationFooterProps> = ({
  page,
  totalPages,
  totalUsers,
  currentCount,
  loading,
  onPageChange,
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-white/5">
      {/* Left: summary */}
      <span className="text-sm text-gray-600 dark:text-gray-400">
        Showing {currentCount} of {totalUsers} users
      </span>

      {/* Right: pagination controls */}
      <div className="flex items-center gap-3">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1 || loading}
        >
          Previous
        </Button>

        <span className="text-sm font-medium text-gray-800 dark:text-white">
          Page {page} of {totalPages}
        </span>

        <Button
          size="sm"
          variant="outline"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages || loading}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default BillingPaginationFooter;
