import { Injectable } from '@nestjs/common';
import { User as PrismaUser, Prisma } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async findOneByEmail(email: string): Promise<PrismaUser | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findOneById(id: number): Promise<PrismaUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      return null;
    }
    return user;
  }

  async create(data: Prisma.UserCreateInput): Promise<PrismaUser> {
    return this.prisma.user.create({
      data,
    });
  }
}
