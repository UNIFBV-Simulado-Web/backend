import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User as PrismaUser } from '@prisma/client';

type UserWithoutPassword = Omit<PrismaUser, 'senha'>;

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'senha' });
  }

  async validate(email: string, pass: string): Promise<UserWithoutPassword> {
    console.log(email, ' + ', pass);
    const user = await this.authService.validateUser(email, pass);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }
    return user;
  }
}
