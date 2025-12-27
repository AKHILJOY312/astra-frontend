import { useState, useEffect, useMemo, useCallback } from "react";
// Import UI components
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

import React from "react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  blockUser,
  changeTheRoleOfUser,
  getAllUserForAdmin,
} from "@/services/adminUser.service";

// --- TYPE DEFINITIONS ---
interface UserModel {
  id: string;
  name: string;
  email: string;
  status: "active" | "blocked";
  role: "admin" | "user";
  image?: string; // Optional image field
}

interface UserListState {
  users: UserModel[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

type ModalAction = {
  user: UserModel;
  type: "status" | "role";
  newValue: "active" | "blocked" | "admin" | "user";
} | null;

// --- ACTUAL COMPONENT ---
export default function UsersList() {
  const [listState, setListState] = useState<UserListState>({
    users: [],
    page: 1,
    limit: 5, // Default limit
    total: 0,
    totalPages: 0,
    loading: false,
    error: null,
  });
  //   const [search, setSearch] = useState<string>("");
  const [modalAction, setModalAction] = useState<ModalAction>(null);
  const isActionLoading = listState.loading; // Use the main loading state for actions too
  const [searchTerm, setSearchTerm] = useState<string>("");

  // --- Data Fetching Logic (useEffect) ---
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= listState.totalPages) {
      setListState((prev) => ({ ...prev, page: newPage }));
    }
  };
  const handleSearchChange = React.useCallback((newSearchTerm: string) => {
    setSearchTerm(newSearchTerm || "");
    setListState((prev) => ({ ...prev, page: 1 }));
  }, []);
  const fetchUsers = useCallback(async () => {
    setListState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      // The execute method in ListUsersUseCase returns AdminUserListResult
      const response = await getAllUserForAdmin(
        listState.page,
        listState.limit,
        searchTerm
      );
      const result = response.data;
      // Map the result to the local UserModel, deriving 'role' from 'isAdmin'
      const mappedUsers: UserModel[] = result.users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        status: u.status,
        role: u.isAdmin ? "admin" : "user",
        image: u.image || "https://via.placeholder.com/40/CCCCCC/808080?text=U", // Placeholder image
      }));

      setListState((prev) => ({
        ...prev,
        users: mappedUsers,
        total: result.total,
        totalPages: result.totalPages,
      }));
    } catch (err: unknown) {
      console.error("Failed to fetch users:", err);

      const message =
        err instanceof Error ? err.message : "Failed to load users.";

      setListState((prev) => ({
        ...prev,
        error: message,
      }));
    } finally {
      setListState((prev) => ({ ...prev, loading: false }));
    }
  }, [listState.page, listState.limit, searchTerm]); // Depend on pagination and search

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // --- Action Handlers (Calling Real Use Cases) ---

  const performAction = useCallback(async (action: ModalAction) => {
    if (!action) return;

    setListState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      let updatedUser: UserModel;

      if (action.type === "status") {
        const newStatus = action.newValue as "active" | "blocked";
        await blockUser(action.user.id);
        updatedUser = { ...action.user, status: newStatus };
      } else {
        // type === 'role'
        // const newRoleIsAdmin = action.newValue === "admin";
        await changeTheRoleOfUser(action.user.id);
        updatedUser = {
          ...action.user,
          role: action.newValue as "admin" | "user",
        };
      }

      // Optimistically update the single user in the list
      setListState((prevList) => ({
        ...prevList,
        users: prevList.users.map((u) =>
          u.id === updatedUser.id ? updatedUser : u
        ),
      }));

      // Log success and close modal
      console.log(
        `Action successful: ${action.type} updated for user ${updatedUser.name}`
      );
    } catch (err: unknown) {
      console.error(`Failed to perform ${action.type} action:`, err);
      const message =
        err instanceof Error ? err.message : "Failed to perform action";
      setListState((prev) => ({
        ...prev,
        error: `Action failed: ${message}`,
      }));
    } finally {
      setModalAction(null); // Close modal regardless of success/failure
      setListState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  // --- Modal Logic (Unchanged) ---

  const openStatusModal = (user: UserModel) => {
    const newStatus = user.status === "active" ? "blocked" : "active";
    setModalAction({ user, type: "status", newValue: newStatus });
  };

  const openRoleModal = (user: UserModel) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    setModalAction({ user, type: "role", newValue: newRole });
  };

  const closeModal = () => setModalAction(null);

  // --- Modal Content Memoization (Unchanged) ---

  const modalContent = useMemo(() => {
    // ... (existing modal content logic)
    if (!modalAction) return null;
    const { user, type, newValue } = modalAction;
    let title = "";
    let message = "";

    if (type === "status") {
      title =
        newValue === "blocked"
          ? `Block ${user.name}?`
          : `Unblock ${user.name}?`;
      message =
        newValue === "blocked"
          ? `Blocking this user will immediately invalidate all their active sessions (log them out). Are you sure?`
          : `Are you sure you want to reactivate ${user.name}'s account?`;
    } else {
      // type === 'role'
      title =
        newValue === "admin"
          ? `Assign Admin Role to ${user.name}?`
          : `Revoke Admin Role from ${user.name}?`;
      message =
        newValue === "admin"
          ? `This grants ${user.name} full administrative privileges. Proceed with caution.`
          : `Are you sure you want to demote ${user.name} to a standard user?`;
    }
    return { title, message };
  }, [modalAction]);

  // --- Render Logic ---

  if (listState.loading && listState.users.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        Loading users...
      </div>
    );
  }

  if (listState.error) {
    return (
      <div className="p-6 text-center text-red-600 dark:text-red-400">
        Error: {listState.error}
      </div>
    );
  } //management

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
      {/* Displaying pagination summary */}
      <SearchBar
        onSearchChange={handleSearchChange}
        isLoading={listState.loading}
      />
      <div className="p-4 text-sm text-gray-600 dark:text-gray-400">
        Showing {listState.users.length} of {listState.total} users. Page{" "}
        {listState.page} of {listState.totalPages}.
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/5">
            <TableRow>
              {/* ... Table Header Cells (User Name, Email, Status, Role, Actions) */}
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                User Name
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Email
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Role
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
            {listState.users.map((user) => (
              <TableRow
                key={user.id}
                className={
                  isActionLoading ? "opacity-50 pointer-events-none" : ""
                }
              >
                {/* User Name + Image */}
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  {/* ... User Name and Image Display ... */}
                  {user.name}
                </TableCell>

                {/* Email */}
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {user.email}
                </TableCell>

                {/* Status Badge */}
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={user.status === "active" ? "success" : "error"}
                  >
                    {
                      user.status /* {user.status.charAt(0).toUpperCase() + user.status.slice(1)} */
                    }
                  </Badge>
                </TableCell>

                {/* Role Badge */}
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={user.role === "admin" ? "warning" : "info"}
                  >
                    {
                      user.role /* {user.role.charAt(0).toUpperCase() + user.role.slice(1)} */
                    }
                  </Badge>
                </TableCell>

                {/* Actions (Buttons) */}
                <TableCell className="px-5 py-4 sm:px-6 text-end">
                  <div className="flex justify-end gap-2">
                    {/* Block/Unblock Button */}
                    <Button
                      className={
                        user.status === "active"
                          ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                          : "bg-green-500 hover:bg-green-600 text-white"
                      }
                      onClick={() => openStatusModal(user)}
                      disabled={isActionLoading}
                    >
                      {user.status === "active" ? "Block" : "Unblock"}
                    </Button>

                    {/* Assign/Revoke Admin Button */}
                    <Button
                      className={
                        user.role === "user"
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-red-600 hover:bg-red-700 text-white"
                      }
                      onClick={() => openRoleModal(user)}
                      disabled={isActionLoading}
                    >
                      {user.role === "user" ? "Make Admin" : "Revoke Admin"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Confirmation Modal */}
      {modalAction && modalContent && (
        <ConfirmationModal
          isOpen={!!modalAction}
          title={modalContent.title}
          message={modalContent.message}
          onClose={closeModal}
          onConfirm={() => performAction(modalAction)}
          isLoading={isActionLoading}
        />
      )}
      <div className="flex justify-between items-center p-4 border-t border-gray-100 dark:border-white/5">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Showing {listState.users.length} of {listState.total} users.
        </span>

        <div className="flex items-center gap-2">
          {/* Previous Button */}
          <Button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
            onClick={() => handlePageChange(listState.page - 1)}
            disabled={listState.page === 1 || listState.loading}
          >
            Previous
          </Button>

          {/* Page Numbers (Simplified Display) */}
          <span className="text-sm font-medium text-gray-800 dark:text-white">
            Page {listState.page} of {listState.totalPages}
          </span>

          {/* Next Button */}
          <Button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
            onClick={() => handlePageChange(listState.page + 1)}
            disabled={
              listState.page === listState.totalPages || listState.loading
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

const Button: React.FC<ButtonProps> = (props) => (
  <button
    {...props}
    className={
      "px-3 py-1 text-xs font-semibold rounded transition-colors duration-150 " +
      props.className
    }
  >
    {props.children}
  </button>
);

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  onClose,
  onConfirm,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    // Modal Overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal Content */}
      <div
        className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-sm dark:bg-gray-800 transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <h3 className="font-bold text-lg text-red-600 dark:text-red-400 border-b pb-2 mb-3">
          {title}
        </h3>

        <p className="py-4 text-gray-600 dark:text-gray-300 text-sm">
          {message}
        </p>

        <div className="flex justify-end gap-3 mt-4">
          <Button
            className="bg-gray-300 hover:bg-gray-400 text-black dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white disabled:bg-red-400"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Confirm"}
          </Button>
        </div>
      </div>
    </div>
  );
};

interface SearchBarProps {
  onSearchChange: (search: string) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearchChange,
  isLoading,
}) => {
  const [searchTerm, setSearchTerm] = React.useState("");

  // Use the debounce hook
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // 300ms debounce

  // Effect to trigger parent component update only after debounce
  React.useEffect(() => {
    onSearchChange(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearchChange]);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 border-b dark:border-white/5">
      <input
        type="text"
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        disabled={isLoading}
        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
      />
      {isLoading && (
        <span className="text-xs text-gray-500 mt-1 block">Searching...</span>
      )}
    </div>
  );
};
