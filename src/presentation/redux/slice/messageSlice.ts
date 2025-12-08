import type { Message } from "@/domain/entities/message/Message";
import { createSlice } from "@reduxjs/toolkit";

interface MessagesState {
  activeChannelId: string | null;
  list: Message[];
}

const initialState: MessagesState = {
  activeChannelId: null,
  list: [],
};

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setActiveChannel(state, action) {
      state.activeChannelId = action.payload;
      state.list = [];
    },
    setMessages(state, action) {
      state.list = action.payload;
    },
    addMessage(state, action) {
      state.list.push(action.payload);
    },
    clearTextMessages(state) {
      state.list = [];
    },
    prependOldMessages(state, action) {
      state.list = [...action.payload, ...state.list];
    },
  },
});

export const {
  setActiveChannel,
  setMessages,
  addMessage,
  clearTextMessages,
  prependOldMessages,
} = messageSlice.actions;
export default messageSlice.reducer;
