// src/data/mappers/userMapper.ts
import type { User } from "../../domain/entities/user/User";

export const userResponseToEntity = (raw: any): User => ({
  id: raw.id,
  name: raw.name,
  email: raw.email,
});
