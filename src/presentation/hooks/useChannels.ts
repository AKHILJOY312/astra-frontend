// src/presentation/hooks/useChannels.ts

import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { container } from "../../di/container";
import { TYPES } from "../../di/types";

import { ListChannelsUseCase } from "../../application/use-cases/channel/ListChannelsUseCase";
import { CreateChannelUseCase } from "../../application/use-cases/channel/CreateChannelUseCase";
import { EditChannelUseCase } from "../../application/use-cases/channel/EditChannelUseCase";
import { DeleteChannelUseCase } from "../../application/use-cases/channel/DeleteChannelUseCase";

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
import type {
  CreateChannelDTO,
  EditChannelDTO,
} from "@/application/repo/IChannelRepository";

const listChannelsUC = container.get<ListChannelsUseCase>(
  TYPES.ListChannelsUseCase
);
const createChannelUC = container.get<CreateChannelUseCase>(
  TYPES.CreateChannelUseCase
);
const editChannelUC = container.get<EditChannelUseCase>(
  TYPES.EditChannelUseCase
);
const deleteChannelUC = container.get<DeleteChannelUseCase>(
  TYPES.DeleteChannelUseCase
);

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
      const data = await listChannelsUC.execute(projectId);

      dispatch(setChannels(data));
    } catch (err: any) {
      dispatch(
        setChannelError(err.message || "Failed to load channels for project.")
      );
    }
  }, [dispatch, projectId]);

  // ---------------------------
  // Create Channel
  // ---------------------------
  const createChannel = async (dto: CreateChannelDTO) => {
    dispatch(clearChannelError());

    try {
      const newChannel = await createChannelUC.execute(projectId, dto);

      dispatch(addChannel(newChannel));
      dispatch(setActiveChannel(newChannel));
      return newChannel;
    } catch (err: any) {
      dispatch(setChannelError(err.message || "Failed to create channel"));
      throw err;
    }
  };

  // ---------------------------
  // Edit Channel
  // ---------------------------
  const editChannel = async (channelId: string, dto: EditChannelDTO) => {
    dispatch(clearChannelError());

    try {
      const updated = await editChannelUC.execute(projectId, channelId, dto);

      dispatch(updateChannel(updated));
      return updated;
    } catch (err: any) {
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
      await deleteChannelUC.execute(projectId, channelId);
      dispatch(removeChannel(channelId));
    } catch (err: any) {
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
