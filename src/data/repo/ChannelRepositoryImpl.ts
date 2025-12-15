import type {
  IChannelRepository,
  CreateChannelDTO,
  EditChannelDTO,
} from "../../application/repo/IChannelRepository";
import { channelResponseToEntity } from "../mappers/channelMapper";
import type { Channel } from "@/domain/entities/channel/Channel";
import * as channelApi from "../api/channelApi";
export class ChannelRepositoryImpl implements IChannelRepository {
  async create(projectId: string, channel: CreateChannelDTO): Promise<Channel> {
    const response = await channelApi.createChannel(projectId, channel);
    return channelResponseToEntity(response.data.data);
  }

  async getByProject(projectId: string): Promise<Channel[]> {
    try {
      const { data } = await channelApi.getChannels(projectId);

      const channelsData = data.channels || data;

      if (!channelsData) {
        console.warn(
          `API call succeeded for project ${projectId}, but no channel data found.`
        );
        return [];
      }

      return channelsData.data.map(channelResponseToEntity);
    } catch (error) {
      console.error(`Error fetching channels for project ${projectId}:`, error);

      throw new Error(
        "Failed to retrieve project channels due to a network or internal issue."
      );
    }
  }

  async update(
    projectId: string,
    channelId: string,
    channel: EditChannelDTO
  ): Promise<Channel> {
    const response = await channelApi.editChannel(
      projectId,
      channelId,
      channel
    );
    return channelResponseToEntity(response.data);
  }

  async delete(projectId: string, channelId: string): Promise<void> {
    await channelApi.deleteChannel(projectId, channelId);
  }
}
