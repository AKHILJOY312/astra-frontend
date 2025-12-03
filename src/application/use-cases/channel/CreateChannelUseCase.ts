// src/application/use-cases/channel/CreateChannelUseCase.ts
import type {
  IChannelRepository,
  CreateChannelDTO,
} from "../../repo/IChannelRepository";
import { Channel } from "../../../domain/entities/channel/Channel";
import { inject, injectable } from "inversify";
import { TYPES } from "@/di/types";
@injectable()
export class CreateChannelUseCase {
  constructor(
    @inject(TYPES.IChannelRepository)
    private channelRepo: IChannelRepository
  ) {}

  async execute(dto: CreateChannelDTO): Promise<Channel> {
    return await this.channelRepo.create(dto);
  }
}
