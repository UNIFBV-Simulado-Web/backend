import {
  ExtractJwt,
  Strategy,
  StrategyOptionsWithoutRequest,
} from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user.service';
import { User as PrismaUser } from '@prisma/client';

interface JwtPayload {
  sub: number;
  email: string;
  name?: string;
}

type UserWithoutPassword = Omit<PrismaUser, 'senha'>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger: Logger;

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UserService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');

    if (!jwtSecret) {
      console.error(
        'FATAL ERROR: JWT_SECRET não está definido nas variáveis de ambiente.',
      );
      throw new Error(
        'FATAL ERROR: JWT_SECRET não está definido nas variáveis de ambiente.',
      );
    }

    const jwtOptions: StrategyOptionsWithoutRequest = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    };

    super(jwtOptions);

    this.logger = new Logger(JwtStrategy.name);
    this.logger.log('JwtStrategy instanciada e configurada.');
  }

  async validate(payload: JwtPayload): Promise<UserWithoutPassword> {
    this.logger.debug(`Validando payload do JWT: ${JSON.stringify(payload)}`);
    const user = await this.usersService.findOneById(payload.sub);
    if (!user) {
      this.logger.warn(
        `Usuário não encontrado para o ID no token JWT: ${payload.sub}`,
      );
      throw new UnauthorizedException(
        'Usuário não encontrado ou token inválido.',
      );
    }
    const { senha, ...result } = user;
    return result;
  }
}
