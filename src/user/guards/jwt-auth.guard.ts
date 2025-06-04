import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);
  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    if (info) {
      this.logger.debug(
        `Informação da validação do JWT: ${info.name} - ${info.message}`,
      );
    }

    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(info?.message || 'Acesso não autorizado.')
      );
    }

    return user;
  }
}
