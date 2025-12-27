import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Channel, ChannelState } from "@/types";

const initialState: ChannelState = {
  channels: [],
  loading: false,
  activeChannelId: null,
  activeChannel: null,
  error: null,
};

const channelSlice = createSlice({
  name: "channel",
  initialState,
  reducers: {
    // ---------------------------
    // Loading & Error
    // ---------------------------
    setChannelLoading(state) {
      state.loading = true;
      state.error = null;
    },
    setChannelError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    clearChannelError(state) {
      state.error = null;
    },

    // ---------------------------
    // CRUD Reducers
    // ---------------------------
    setChannels(state, action: PayloadAction<Channel[]>) {
      state.channels = action.payload;
      state.loading = false;
    },
    addChannel(state, action: PayloadAction<Channel>) {
      state.channels.push(action.payload);
    },
    updateChannel(state, action: PayloadAction<Channel>) {
      const idx = state.channels.findIndex((c) => c.id === action.payload.id);

      if (idx !== -1) {
        state.channels[idx] = action.payload;
      }

      //  KEEP ACTIVE CHANNEL IN SYNC
      if (state.activeChannelId === action.payload.id) {
        state.activeChannel = action.payload;
      }
    },
    removeChannel(state, action: PayloadAction<string>) {
      state.channels = state.channels.filter((c) => c.id !== action.payload);
    },
    setActiveChannel(state, action: PayloadAction<Channel | null>) {
      state.activeChannelId = action.payload?.id ?? null;
      state.activeChannel = action.payload;
    },
  },
});

export const {
  setChannels,
  addChannel,
  updateChannel,
  removeChannel,
  setChannelLoading,
  setChannelError,
  clearChannelError,
  setActiveChannel,
} = channelSlice.actions;

export default channelSlice.reducer;
