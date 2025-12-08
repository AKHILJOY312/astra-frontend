import type { Channel } from "@/domain/entities/channel/Channel";

export interface CreateChannelDTO {
  channelName: string;
  description?: string;

  visibleToRoles: ("manager" | "lead" | "member")[];
  permissionsByRole: Record<
    "manager" | "lead" | "member",
    "view" | "message" | "manager"
  >;
}
export interface CreateChannelResultDTO {
  channel: Channel;
}

export interface EditChannelDTO {
  channelName?: string;
  description?: string;

  visibleToRoles?: ("manager" | "lead" | "member")[];
  permissionsByRole?: Record<
    "manager" | "lead" | "member",
    "view" | "message" | "manager"
  >;
}
export interface EditChannelResultDTO {
  updated: Channel;
}

export interface DeleteChannelDTO {
  channelId: string;
  userId: string;
}
export interface DeleteChannelResultDTO {
  deleted: Channel | null;
}

export interface ListProjectChannelsDTO {
  projectId: string;
  userId: string;
}
export interface ListProjectChannelsResultDTO {
  channels: Channel[];
}

export interface IChannelRepository {
  create(projectId: string, channel: CreateChannelDTO): Promise<Channel>;

  update(
    projectId: string,
    channelId: string,
    channel: EditChannelDTO
  ): Promise<Channel>;
  delete(projectId: string, channelId: string): Promise<void>;
  getByProject(projectId: string): Promise<Channel[]>;
  // getById(channelId: string): Promise<Channel | null>;

  // findByProjectAndName(
  //   projectId: string,
  //   channelName: string
  // ): Promise<Channel | null>;

  // countByProjectId(projectId: string): Promise<number>;
}
