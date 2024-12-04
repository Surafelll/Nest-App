import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import PrismaService from 'src/prisma/prisma.service';


@Injectable()
export class NotDeletedUserGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.sub;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    return user && user.deletedAt === null;  // Ensure `deletedAt` is null
  }
}
