// src/application/use-cases/channel/DeleteChannelUseCase.ts
import { inject, injectable } from "inversify";
import { type IChannelRepository } from "../../repo/IChannelRepository";
import { TYPES } from "@/di/types";
@injectable()
export class DeleteChannelUseCase {
  constructor(
    @inject(TYPES.IChannelRepository)
    private channelRepo: IChannelRepository
  ) {}

  async execute(projectId: string, channelId: string): Promise<void> {
    await this.channelRepo.delete(projectId, channelId);
  }
}
