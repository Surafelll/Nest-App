import { Injectable } from '@nestjs/common';
import AuthDto from 'src/auth/dto/signupAuth.dto';
import UpdateUserDto from './dto/updateUser.dto';
import CreatedUser from './createdUserResponse';
import PrismaService from 'src/prisma/prisma.service';
import CustomErrorException from 'src/Comp/Erorr/CustomErrorException';


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
        throw new CustomErrorException('User not found', 404);
      }

      if (user.id !== incomingId) {
        throw new CustomErrorException('You are forbidden to delete this user', 403);
      }

      await this.prisma.user.update({
        where: { id: userId },
        data: { deletedAt: new Date() },
      });

      return { message: 'User deleted successfully' };
    } catch (error) {
      CustomErrorException.handle(error, 'User Deletion');
    }
  }

  async getAllUsers(): Promise<CreatedUser[]> {
    try {
      const allUsers = await this.prisma.user.findMany({
        where: { deletedAt: null }, // Only return users who are not deleted
      });

      if (allUsers.length === 0) {
        throw new CustomErrorException('No users found', 404);
      }

      return allUsers;
    } catch (error) {
      CustomErrorException.handle(error, 'Fetching Users');
    }
  }

  async updateUser(userId: number, dto: UpdateUserDto, incomingId: number): Promise<CreatedUser> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new CustomErrorException('User not found', 404);
      }

      if (user.id !== incomingId) {
        throw new CustomErrorException('You are forbidden to update this user', 403);
      }

      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: {
          ...dto,
        },
      });

      return updatedUser;
    } catch (error) {
      CustomErrorException.handle(error, 'User Update');
    }
  }

  async restoreUser(userId: number, incomingId: number): Promise<{ message: string }> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user || user.deletedAt === null) {
        throw new CustomErrorException('User not found or not deleted', 404);
      }

      if (user.id !== incomingId) {
        throw new CustomErrorException('You are forbidden to restore this user', 403);
      }

      await this.prisma.user.update({
        where: { id: userId },
        data: { deletedAt: null },
      });

      return { message: 'User restored successfully' };
    } catch (error) {
      CustomErrorException.handle(error, 'User Restoration');
    }
  }
}
