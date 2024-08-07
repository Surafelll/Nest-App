import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import UserDecorator from 'src/Comp/decorators/userDecorators';
import ProfileService from './profile.service';
import ProfileDto from './dto/createProfile.dto';
import UpdateProfileDto from './dto/updateProfile.dto';
import CreatedProfile from './createdProfileResponse';


@ApiTags('Profile')
@ApiBearerAuth('JWT-auth')

@UseGuards(AuthGuard('jwt'))
@Controller('profiles')
@UseGuards(AuthGuard('jwt'))
export default class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @ApiCreatedResponse({ type: CreatedProfile })
  async post(@Body() dto: ProfileDto): Promise<CreatedProfile> {
    return this.profileService.post(dto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Profile deleted successfully.' })
  async delete(@Param('id') id: string, @UserDecorator() user: any): Promise<void> {
    const profileId = parseInt(id, 10);
    await this.profileService.deleteProfile(profileId, user.sub);
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: CreatedProfile })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProfileDto,
    @UserDecorator() user: any,
  ): Promise<CreatedProfile> {
    const profileId = parseInt(id, 10);
    return this.profileService.updateProfile(profileId, dto, user.sub);
  }
}
