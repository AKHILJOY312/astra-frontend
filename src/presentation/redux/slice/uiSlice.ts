// src/presentation/redux/slices/uiSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  sidebarOpen: boolean;
  theme: "light" | "dark";
  createProjectModal: boolean;
  inviteMemberModal: boolean;
  createChannelModal: boolean;
  upgradePlanModal: boolean;
  mobileMenuOpen: boolean;
  viewMembersModalOpen: boolean;
}

const initialState: UIState = {
  sidebarOpen: true,
  theme: "light",
  createProjectModal: false,
  inviteMemberModal: false,
  createChannelModal: false,
  upgradePlanModal: false,
  mobileMenuOpen: false,
  viewMembersModalOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
    },
    openCreateProjectModal: (state) => {
      state.createProjectModal = true;
    },
    closeCreateProjectModal: (state) => {
      state.createProjectModal = false;
    },
    openInviteMemberModal: (state) => {
      state.inviteMemberModal = true;
    },
    closeInviteMemberModal: (state) => {
      state.inviteMemberModal = false;
    },
    openCreateChannelModal: (state) => {
      state.createChannelModal = true;
    },
    closeCreateChannelModal: (state) => {
      state.createChannelModal = false;
    },
    openUpgradePlanModal: (state) => {
      state.upgradePlanModal = true;
    },
    closeUpgradePlanModal: (state) => {
      state.upgradePlanModal = false;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    closeMobileMenu: (state) => {
      state.mobileMenuOpen = false;
    },
    openViewMembersModal(state) {
      state.viewMembersModalOpen = true;
    },
    closeViewMembersModal(state) {
      state.viewMembersModalOpen = false;
    },
  },
});

export const {
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
} = uiSlice.actions;

export default uiSlice.reducer;
