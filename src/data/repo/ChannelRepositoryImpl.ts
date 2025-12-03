import type {
  IChannelRepository,
  CreateChannelDTO,
} from "../../application/repo/IChannelRepository";
import apiCaller from "../../lib/apicaller";
import { channelResponseToEntity } from "../mappers/channelMapper";
import type { Channel } from "@/domain/entities/channel/Channel";

export class ChannelRepositoryImpl implements IChannelRepository {
  async create(dto: CreateChannelDTO): Promise<Channel> {
    const { data } = await apiCaller.post("/channels", dto);
    return channelResponseToEntity(data.channel || data);
  }

  async getByProject(projectId: string): Promise<Channel[]> {
    const { data } = await apiCaller.get(`/projects/${projectId}/channels`);
    return data.channels
      ? data.channels.map(channelResponseToEntity)
      : data.map(channelResponseToEntity);
  }

  async getById(channelId: string): Promise<Channel | null> {
    try {
      const { data } = await apiCaller.get(`/channels/${channelId}`);
      return channelResponseToEntity(data.channel || data);
    } catch (err: any) {
      if (err.response?.status === 404) return null;
      throw err;
    }
  }

  async delete(channelId: string): Promise<void> {
    await apiCaller.delete(`/channels/${channelId}`);
  }
}
