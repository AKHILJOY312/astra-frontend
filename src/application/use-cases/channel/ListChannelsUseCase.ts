// src/application/use-cases/channel/ListChannelsUseCase.ts
import type { IChannelRepository } from "@/application/repo/IChannelRepository";
import { TYPES } from "@/di/types";
import type { Channel } from "@/domain/entities/channel/Channel";
import { inject, injectable } from "inversify";
@injectable()
export class ListChannelsUseCase {
  constructor(
    @inject(TYPES.IChannelRepository) private channelRepo: IChannelRepository
  ) {}

  async execute(projectId: string): Promise<Channel[]> {
    return await this.channelRepo.getByProject(projectId);
  }
}
