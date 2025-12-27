// src/presentation/hooks/useChannels.ts

import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  setChannels,
  addChannel,
  updateChannel,
  removeChannel,
  setChannelLoading,
  setChannelError,
  clearChannelError,
  setActiveChannel,
} from "../redux/slice/channelSlice";

import type { RootState, AppDispatch } from "../redux/store/store";
import type { CreateChannel, EditChannel } from "@/types";
import {
  getChannels,
  UserCreateChannel,
  UserDeleteChannel,
  UserEditChannel,
} from "@/services/channel.service";

interface ChannelError {
  message: string;
}

export const useChannels = (projectId: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const { channels, loading, error, activeChannelId } = useSelector(
    (state: RootState) => state.channel
  );

  // ---------------------------
  // Load Channels
  // ---------------------------
  const loadChannels = useCallback(async () => {
    if (!projectId) return;

    dispatch(setChannelLoading());
    try {
      const data = await getChannels(projectId);
      dispatch(setChannels(data.data.data));
    } catch (error) {
      const err = error as ChannelError;
      dispatch(
        setChannelError(err.message || "Failed to load channels for project.")
      );
    }
  }, [dispatch, projectId]);

  // ---------------------------
  // Create Channel
  // ---------------------------
  const createChannel = async (dto: CreateChannel) => {
    dispatch(clearChannelError());

    try {
      const newChannel = await UserCreateChannel(projectId, dto);

      dispatch(addChannel(newChannel.data));
      dispatch(setActiveChannel(newChannel.data));
      return newChannel;
    } catch (error) {
      const err = error as ChannelError;
      dispatch(setChannelError(err.message || "Failed to create channel"));
      throw err;
    }
  };

  // ---------------------------
  // Edit Channel
  // ---------------------------
  const editChannel = async (channelId: string, dto: EditChannel) => {
    dispatch(clearChannelError());

    try {
      const updated = await UserEditChannel(projectId, channelId, dto);

      dispatch(updateChannel(updated.data));
      return updated;
    } catch (error) {
      const err = error as ChannelError;
      dispatch(setChannelError(err.message || "Failed to edit channel"));
      throw err;
    }
  };

  // ---------------------------
  // Delete Channel
  // ---------------------------
  const deleteChannel = async (channelId: string) => {
    dispatch(clearChannelError());

    try {
      await UserDeleteChannel(projectId, channelId);
      dispatch(removeChannel(channelId));
    } catch (error) {
      const err = error as ChannelError;
      dispatch(setChannelError(err.message || "Failed to delete channel"));
      throw err;
    }
  };

  // Auto-load channels
  useEffect(() => {
    loadChannels();
  }, [loadChannels]);

  return {
    channels,
    loading,
    error,
    activeChannelId,

    refreshChannels: loadChannels,
    createChannel,
    editChannel,
    deleteChannel,
    clearError: () => dispatch(clearChannelError()),
  };
};
