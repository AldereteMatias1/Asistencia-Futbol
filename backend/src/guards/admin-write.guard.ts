import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class AdminWriteGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const method = request.method?.toUpperCase();

    if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
      return true;
    }

    const expectedKey = this.configService.get<string>('ADMIN_API_KEY');
    const headerValue = request.headers['x-api-key'];
    const providedKey = Array.isArray(headerValue) ? headerValue[0] : headerValue;

    if (expectedKey && providedKey === expectedKey) {
      return true;
    }

    throw new UnauthorizedException(
      'Se requiere x-api-key de ADMIN para esta operación',
    );
  }
}
