import { Injectable, NotFoundException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import AuthDto from 'src/auth/dto/signupAuth.dto';
import UpdateUserDto from './dto/updateUser.dto';
import CreatedUser from './createdUserResponse';
import PrismaService from 'src/prisma/prisma.service';

@Injectable()
export default class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async deleteUser(userId: number, incomingId: number): Promise<{ message: string }> {
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

    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while deleting the user');
    }

    return { message: 'User deleted successfully' };
  }

  async getAllUsers(): Promise<CreatedUser[]> {
    const allUsers = await this.prisma.user.findMany({
      where: { deletedAt: null },  // Only return users who are not deleted
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
