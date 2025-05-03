import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

interface JwtPayload {
  userId: string;
  email: string;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const publicKey = `-----BEGIN PUBLIC KEY-----\n${process.env.JWT_PUBLIC_KEY}\n-----END PUBLIC KEY-----`;
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        publicKey,
        algorithms: ['RS256'] as const,
    });

      request['user'] = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token', err);
    }
  }

  private extractToken(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
