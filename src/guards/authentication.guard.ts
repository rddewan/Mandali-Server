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
    const request = context.switchToHttp().getRequest();

     // Check if the route is marked as public
    const isPublicRoute = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    const token = this.extractTokenFromRequest(request);

    if (!token) {
      // If no token is present, set authState to false
      request.authState = { isAuthenticated: false };
      
      // Allow access to public routes without a token
      if (isPublicRoute) {
        return true;
      } else {
        throw new UnauthorizedException('Access token is required for this route');
      }
    }

    // If a token is present, validate it
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      });

      // Check if the user exists in the database
      const user = await this.prismaService.user.findUnique({
        where: { id: payload.sub },
      });

      if (user) {
        // Token is valid, user exists
        request.user = user;
        request.authState = { isAuthenticated: true };
      } else {
        // Token is valid, but user does not exist
        request.authState = { isAuthenticated: false };
        if (!isPublicRoute) {
          throw new UnauthorizedException('User not found');
        }
      }
    } catch (error) {
      // Token verification failed
      request.authState = { isAuthenticated: false };

      if (!isPublicRoute) {
        throw new UnauthorizedException('Invalid access token');
      }
    }

    // Allow all requests (public or authenticated)
    return true;
  }

  private extractTokenFromRequest(request: Request): string | undefined {
    // Check Authorization header (for mobile clients)
    const bearerToken = this.extractTokenFromHeader(request);
    
    // Check HTTP-only cookie (for web clients)
    const cookieToken = request.cookies?.access_token;

    // Prioritize Authorization header, fallback to cookie if header is not present
    return bearerToken || cookieToken;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
