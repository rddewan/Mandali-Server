import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Request } from 'express-serve-static-core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/common/decorators';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // check if it's a public route
    const isPublicRoute = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If public router return true
    // else check if token exists and verify jwt token
    if (isPublicRoute) {
      return true;
    } else {
      const request = context.switchToHttp().getRequest();
      const token = this.extractToken(request);
      if (!token) {
        throw new UnauthorizedException('Please login first');
      }

      try {
        // verify token
        const payload = await this.jwtService.verifyAsync(token, {
          secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        });

        // check if user exists in DB
        const user = await this.prismaService.user.findUnique({
          where: {
            id: payload.sub,
          },
        });

        // if no user throw error
        if (!user) {
          throw new UnauthorizedException(
            'User does not exist for this authorization token',
          );
        }

        // if user exists - set user in request
        request.user = user;
      } catch (error) {
        throw new UnauthorizedException('Authorization token is not valid');
      }

      return true;
    }
  }

  private extractToken(request: Request): string | undefined {
    // Check Authorization header (for mobile clients)
    const authHeaderToken = this.extractTokenFromHeader(request);
    
    // Check HTTP-only cookie (for web clients)
    const cookieToken = request.cookies?.access_token; // Adjust the cookie name as needed

    // Prioritize Authorization header, fallback to cookie if header is not present
    return authHeaderToken || cookieToken;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
