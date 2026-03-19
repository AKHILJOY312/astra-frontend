// src/presentation/hooks/useUi.ts
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  toggleSidebar,
  setSidebarOpen,
  toggleTheme,
  setTheme,
  openCreateProjectModal,
  closeCreateProjectModal,
  openInviteMemberModal,
  closeInviteMemberModal,
  openCreateChannelModal,
  closeCreateChannelModal,
  openUpgradePlanModal,
  closeUpgradePlanModal,
  toggleMobileMenu,
  closeMobileMenu,
  openViewMembersModal,
  closeViewMembersModal,
  openEditProjectModal,
  closeEditProjectModal,
  showAlert,
  hideAlert,
} from "@/redux/slice/uiSlice";
import type { UiAlertType } from "@/types/ui.types";

export const useUi = () => {
  const dispatch = useAppDispatch();

  //  UI STATE
  const {
    sidebarOpen,
    theme,
    createProjectModal,
    inviteMemberModal,
    createChannelModal,
    upgradePlanModal,
    mobileMenuOpen,
    viewMembersModalOpen,
    editProjectModalOpen,
  } = useAppSelector((state) => state.ui);

  //  ACTIONS (wrapped with callbacks)
  const actions = {
    toggleSidebar: useCallback(() => dispatch(toggleSidebar()), [dispatch]),

    setSidebarOpen: useCallback(
      (open: boolean) => dispatch(setSidebarOpen(open)),
      [dispatch],
    ),

    toggleTheme: useCallback(() => dispatch(toggleTheme()), [dispatch]),

    setTheme: useCallback(
      (theme: "light" | "dark") => dispatch(setTheme(theme)),
      [dispatch],
    ),

    openCreateProject: useCallback(
      () => dispatch(openCreateProjectModal()),
      [dispatch],
    ),

    closeCreateProject: useCallback(
      () => dispatch(closeCreateProjectModal()),
      [dispatch],
    ),

    openInviteMember: useCallback(
      () => dispatch(openInviteMemberModal()),
      [dispatch],
    ),

    closeInviteMember: useCallback(
      () => dispatch(closeInviteMemberModal()),
      [dispatch],
    ),

    openCreateChannel: useCallback(
      () => dispatch(openCreateChannelModal()),
      [dispatch],
    ),

    closeCreateChannel: useCallback(
      () => dispatch(closeCreateChannelModal()),
      [dispatch],
    ),

    openUpgradePlan: useCallback(
      () => dispatch(openUpgradePlanModal()),
      [dispatch],
    ),

    closeUpgradePlan: useCallback(
      () => dispatch(closeUpgradePlanModal()),
      [dispatch],
    ),

    toggleMobileMenu: useCallback(
      () => dispatch(toggleMobileMenu()),
      [dispatch],
    ),

    closeMobileMenu: useCallback(() => dispatch(closeMobileMenu()), [dispatch]),

    openViewMembers: useCallback(
      () => dispatch(openViewMembersModal()),
      [dispatch],
    ),

    closeViewMembers: useCallback(
      () => dispatch(closeViewMembersModal()),
      [dispatch],
    ),
    openEditProject: useCallback(
      () => dispatch(openEditProjectModal()),
      [dispatch],
    ),
    closeEditProjectModal: useCallback(
      () => dispatch(closeEditProjectModal()),
      [dispatch],
    ),

    displayAlert: useCallback(
      (type: UiAlertType, message: string) =>
        dispatch(showAlert({ type, message })),
      [dispatch],
    ),

    clearAlert: useCallback(() => dispatch(hideAlert()), [dispatch]),
  };

  return {
    // state
    sidebarOpen,
    theme,
    createProjectModal,
    inviteMemberModal,
    createChannelModal,
    upgradePlanModal,
    mobileMenuOpen,
    viewMembersModalOpen,
    editProjectModalOpen,

    // actions
    ...actions,
  };
};
