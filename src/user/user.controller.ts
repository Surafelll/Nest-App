import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import AuthDto from 'src/auth/dto/signupAuth.dto';
import AccessTokenResponseDto from 'src/auth/accessTokenResponse';
import AuthService from 'src/auth/auth.service';
import UserService from './user.service';
import UpdateUserDto from './dto/updateUser.dto';
import CreatedUser from './createdUserResponse';
import UserDecorator from 'src/Comp/decorators/userDecorators';

@Controller('users')
export default class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('')
  @ApiCreatedResponse({
    type: AccessTokenResponseDto,
  })
  async signup(@Body() dto: AuthDto): Promise<{ access_token: string }> {
    return this.authService.signup(dto);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'User deleted successfully.',
  })
  async delete(
    @Param('id') id: string,
    @UserDecorator() user: any,
  ): Promise<{ message: string }> {
    const userId = parseInt(id, 10);
    await this.userService.deleteUser(userId, user.sub);
    return { message: 'User deleted successfully.' };
  }

  @Get()
  @ApiOkResponse({
    type: [CreatedUser],
  })
  async getAllPosts(): Promise<CreatedUser[]> {
    return this.userService.getAllUsers();
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @UserDecorator() user: any,
  ): Promise<CreatedUser> {
    const userId = parseInt(id, 10);
    return this.userService.updateUser(userId, dto, user.sub);
  }
}
