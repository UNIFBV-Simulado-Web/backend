import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User as PrismaUser, Prisma } from '@prisma/client';

type UserWithoutPassword = Omit<PrismaUser, 'senha'>;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<UserWithoutPassword | null> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.senha))) {
      const { senha, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: UserWithoutPassword) {
    const payload = {
      email: user.email,
      sub: user.id,
      name: user.nomeCompleto,
    };
    this.logger.log(
      `Gerando token para usuário: ${user.email} (ID: ${user.id})`,
    );
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(
    createUserDto: Prisma.UserCreateInput,
  ): Promise<UserWithoutPassword> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.senha, saltRounds);

    const existingUser = await this.usersService.findOneByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new UnauthorizedException('Este e-mail já está em uso.');
    }

    const newUser = await this.usersService.create({
      ...createUserDto,
      senha: hashedPassword,
    });

    const { senha, ...result } = newUser;
    return result;
  }
}
