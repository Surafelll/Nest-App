import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import PrismaService from 'src/prisma/prisma.service';
import ProfileDto from './dto/createProfile.dto';
import UpdateProfileDto from './dto/updateProfile.dto';
import  CreatedProfile  from './createdProfileResponse';

@Injectable()
export default class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async post(dto: ProfileDto): Promise<CreatedProfile> {
    const newProfile = await this.prisma.profile.create({
      data: {
        nickname:dto.nickname,
        category:dto.category,
        image: dto.image,
        location: dto.location,
        bio: dto.bio,
        user: {
          connect: { id: Number(dto.userId) },
        },
      },
    });

    return this.mapToCreatedProfile(newProfile);
  }

  async deleteProfile(profileId: number, incomingId: number): Promise<{ message: string }> {
    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
      include: {
        user: true,
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    if (profile.user.id !== incomingId) {
      throw new UnauthorizedException('You are not authorized to delete this profile');
    }

    await this.prisma.profile.delete({
      where: { id: profileId },
    });

    return { message: 'Profile deleted successfully' };
  }

  async updateProfile(
    profileId: number,
    dto: UpdateProfileDto,
    incomingId: number,
  ): Promise<CreatedProfile> {
    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
      include: {
        user: true,
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    if (profile.user.id !== incomingId) {
      throw new UnauthorizedException('You are not authorized to update this profile');
    }

    const updateData = {
      Nickname: dto.nickname,
      location: dto.location,
      bio: dto.bio,
      category: dto.category,
    };

    const updatedProfile = await this.prisma.profile.update({
      where: { id: profileId },
      data: updateData,
    });

    return this.mapToCreatedProfile(updatedProfile);
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
