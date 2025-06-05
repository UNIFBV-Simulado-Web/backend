import { Exclude } from 'class-transformer';
import { User as PrismaUser } from '@prisma/client';

export class User implements Partial<PrismaUser> {
  id: number;
  email: string;
  nomeCompleto?: string | undefined;

  @Exclude()
  senha: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
