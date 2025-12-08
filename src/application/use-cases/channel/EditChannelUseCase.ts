// src/application/use-cases/channel/DeleteChannelUseCase.ts
import { inject, injectable } from "inversify";
import {
  type EditChannelDTO,
  type IChannelRepository,
} from "../../repo/IChannelRepository";
import { TYPES } from "@/di/types";
import type { Channel } from "@/domain/entities/channel/Channel";
@injectable()
export class EditChannelUseCase {
  constructor(
    @inject(TYPES.IChannelRepository)
    private channelRepo: IChannelRepository
  ) {}

  async execute(
    projectId: string,
    channelId: string,
    dto: EditChannelDTO
  ): Promise<Channel> {
    return await this.channelRepo.update(projectId, channelId, dto);
  }
}
