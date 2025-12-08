import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Channel } from "@/domain/entities/channel/Channel";

interface ChannelState {
  channels: Channel[];
  loading: boolean;
  activeChannelId: string | null;
  error: string | null;
}

const initialState: ChannelState = {
  channels: [],
  loading: false,
  activeChannelId: null,
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
      if (idx !== -1) state.channels[idx] = action.payload;
    },
    removeChannel(state, action: PayloadAction<string>) {
      state.channels = state.channels.filter((c) => c.id !== action.payload);
    },
    setActiveChannel(state, action: PayloadAction<string | null>) {
      state.activeChannelId = action.payload;
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
