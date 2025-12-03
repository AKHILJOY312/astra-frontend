import type { Channel } from "@/domain/entities/channel/Channel";

export interface CreateChannelDTO {
  projectId: string;
  channelName: string;
  description?: string;
  isPrivate?: boolean;
}

export interface IChannelRepository {
  create(dto: CreateChannelDTO): Promise<Channel>;
  getByProject(projectId: string): Promise<Channel[]>;
  getById(channelId: string): Promise<Channel | null>;
  delete(channelId: string): Promise<void>;
}
