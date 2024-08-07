import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';

import AuthDto from 'src/auth/dto/signupAuth.dto';
import UpdateUserDto from './dto/updateUser.dto';
import CreatedUser from './createdUserResponse';
import PrismaService from 'src/prisma/prisma.service';

@Injectable()
export default class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async deleteUser(userId: number, incomingId: number): Promise<{ message: string }> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: true,
          posts: true,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.id !== incomingId) {
        throw new ForbiddenException('You are forbidden to delete this user');
      }

      await this.prisma.user.update({
        where: { id: userId },
        data: { deletedAt: new Date() },
      });

      return { message: 'User deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new Error('An error occurred while deleting the user');
      }
    }
  }

  async getAllUsers(): Promise<CreatedUser[]> {
    const allUsers = await this.prisma.user.findMany({
      where: { deletedAt: null },
    });

    if (allUsers.length === 0) {
      throw new NotFoundException('No users found');
    }

    return allUsers;
  }

  async updateUser(userId: number, dto: UpdateUserDto, incomingId: number): Promise<CreatedUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.id !== incomingId) {
      throw new ForbiddenException('You are forbidden to update this user');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...dto,
      },
    });

    return updatedUser;
  }

  async restoreUser(userId: number, incomingId: number): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.deletedAt === null) {
      throw new NotFoundException('User not found or not deleted');
    }

    if (user.id !== incomingId) {
      throw new ForbiddenException('You are forbidden to restore this user');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { deletedAt: null },
    });

    return { message: 'User restored successfully' };
  }
}
