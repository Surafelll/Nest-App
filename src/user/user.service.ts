import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import PrismaService from 'src/prisma/prisma.service';
import UpdateUserDto from './dto/updateUser.dto';

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

      if (user.profile) {
        await this.prisma.profile.delete({
          where: { id: user.profile.id },
        });
      }

      if (user.posts.length > 0) {
        await Promise.all(
          user.posts.map(post =>
            this.prisma.post.delete({
              where: { id: post.id },
            }),
          ),
        );
      }

      await this.prisma.user.delete({
        where: { id: userId },
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

  async getAllUsers(): Promise<any[]> {
    try {
      const allUsers = await this.prisma.user.findMany();

      if (allUsers.length === 0) {
        throw new NotFoundException('No users found');
      }

      return allUsers;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new Error('An error occurred while fetching users');
      }
    }
  }

  async updateUser(userId: number, dto: UpdateUserDto, incomingId: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.id !== incomingId) {
        throw new UnauthorizedException('You are not authorized to update this user');
      }

      const updateData: Partial<UpdateUserDto> = {};

      if (dto.First_name) {
        updateData.First_name = dto.First_name;
      }
      if (dto.Last_name) {
        updateData.Last_name = dto.Last_name;
      }
      if (dto.email) {
        updateData.email = dto.email;
      }
      if (dto.username) {
        updateData.username = dto.username;
      }
      if (dto.fullname) {
        updateData.fullname = dto.fullname;
      }
      if (dto.password) {
        updateData.password = dto.password;
      }

      return await this.prisma.user.update({
        where: { id: userId },
        data: updateData,
      });
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof NotFoundException
      ) {
        throw error;
      } else {
        throw new Error('An error occurred while updating the user');
      }
    }
  }
}
