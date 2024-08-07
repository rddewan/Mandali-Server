import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<RoleType[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true; // No roles required, allow access
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Fetch the user's roles from the database
    const userRoles = await this.prisma.userRole.findMany({
      where: {
        userId: user.id,
      },
      include: {
        role: true,
      },
    });

    const roles = userRoles.map((userRole) => userRole.role.name);

    return requiredRoles.some((role) => roles.includes(role));
  }
}
