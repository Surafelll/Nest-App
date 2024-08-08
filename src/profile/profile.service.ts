import { Injectable } from '@nestjs/common';
import PrismaService from 'src/prisma/prisma.service';
import ProfileDto from './dto/createProfile.dto';
import UpdateProfileDto from './dto/updateProfile.dto';
import CreatedProfile from './createdProfileResponse';
import CustomErrorException from 'src/Comp/Erorr/CustomErrorException';

@Injectable()
export default class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async post(dto: ProfileDto): Promise<CreatedProfile> {
    try {
      const newProfile = await this.prisma.profile.create({
        data: {
          nickname: dto.nickname,
          category: dto.category,
          image: dto.image,
          location: dto.location,
          bio: dto.bio,
          user: {
            connect: { id: Number(dto.userId) },
          },
        },
      });

      return this.mapToCreatedProfile(newProfile);
    } catch (error) {
      CustomErrorException.handle(error, 'Profile Creation');
    }
  }

  async deleteProfile(profileId: number, incomingId: number): Promise<{ message: string }> {
    try {
      const profile = await this.prisma.profile.findUnique({
        where: { id: profileId },
        include: {
          user: true,
        },
      });

      if (!profile) {
        throw new CustomErrorException('Profile not found', 404);
      }

      if (profile.user.id !== incomingId) {
        throw new CustomErrorException('You are not authorized to delete this profile', 401);
      }

      await this.prisma.profile.delete({
        where: { id: profileId },
      });

      return { message: 'Profile deleted successfully' };
    } catch (error) {
      CustomErrorException.handle(error, 'Profile Deletion');
    }
  }

  async updateProfile(
    profileId: number,
    dto: UpdateProfileDto,
    incomingId: number,
  ): Promise<CreatedProfile> {
    try {
      const profile = await this.prisma.profile.findUnique({
        where: { id: profileId },
        include: {
          user: true,
        },
      });

      if (!profile) {
        throw new CustomErrorException('Profile not found', 404);
      }

      if (profile.user.id !== incomingId) {
        throw new CustomErrorException('You are not authorized to update this profile', 401);
      }

      const updateData = {
        nickname: dto.nickname,
        location: dto.location,
        bio: dto.bio,
        category: dto.category,
      };

      const updatedProfile = await this.prisma.profile.update({
        where: { id: profileId },
        data: updateData,
      });

      return this.mapToCreatedProfile(updatedProfile);
    } catch (error) {
      CustomErrorException.handle(error, 'Profile Update');
    }
  }

  private mapToCreatedProfile(profile: any): CreatedProfile {
    return {
      id: profile.id,
      image: profile.image,
      bio: profile.bio,
      userId: profile.userId,
      location: profile.location,
      nickname: profile.nickname,
      category: profile.category,
      updatedAt: profile.updatedAt,
      createdAt: profile.createdAt,
    };
  }
}
