import type {
  IChannelRepository,
  CreateChannelDTO,
  EditChannelDTO,
} from "../../application/repo/IChannelRepository";
import { channelResponseToEntity } from "../mappers/channelMapper";
import type { Channel } from "@/domain/entities/channel/Channel";
import * as channelApi from "../api/channelApi";
export class ChannelRepositoryImpl implements IChannelRepository {
  //
  async create(projectId: string, channel: CreateChannelDTO): Promise<Channel> {
    const { data } = await channelApi.createChannel(projectId, channel);
    return channelResponseToEntity(data.channel || data);
  }

  // src/infra/repository/ChannelRepository.ts (Example location)

  // Assuming channelApi is an axios/fetch wrapper and
  // channelResponseToEntity is your data mapping function.

  async getByProject(projectId: string): Promise<Channel[]> {
    try {
      const { data } = await channelApi.getChannels(projectId);
      console.log("Data get By Project: ", data);

      // Assuming the API response structure is either { channels: [...] } or just [...]
      const channelsData = data.channels || data;

      if (!channelsData) {
        // Handle cases where 'data' or 'data.channels' is missing/null/undefined
        console.warn(
          `API call succeeded for project ${projectId}, but no channel data found.`
        );
        return [];
      }

      // Map the response data to the domain entity (Channel)
      return channelsData.data.map(channelResponseToEntity);
    } catch (error) {
      console.error(`Error fetching channels for project ${projectId}:`, error);

      // You should throw a more application-specific error here (e.g., DomainError)
      // for your use cases to catch, instead of a raw network error.
      throw new Error(
        "Failed to retrieve project channels due to a network or internal issue."
      );
    }
  }

  // async getById(channelId: string): Promise<Channel | null> {
  //   try {
  //     const { data } = await channelApi.
  //     return channelResponseToEntity(data.channel || data);
  //   } catch (err: any) {
  //     if (err.response?.status === 404) return null;
  //     throw err;
  //   }
  // }
  async update(
    projectId: string,
    channelId: string,
    channel: EditChannelDTO
  ): Promise<Channel> {
    const { data } = await channelApi.editChannel(
      projectId,
      channelId,
      channel
    );
    return channelResponseToEntity(data.channel || data);
  }

  async delete(projectId: string, channelId: string): Promise<void> {
    await channelApi.deleteChannel(projectId, channelId);
  }
}
