import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import AuthDto from 'src/auth/dto/signupAuth.dto';
import AccessTokenResponseDto from 'src/auth/accessTokenResponse';
import AuthService from 'src/auth/auth.service';
import UserService from './user.service';
import UpdateUserDto from './dto/updateUser.dto';
import CreatedUser from './createdUserResponse';
import UserDecorator from 'src/Comp/decorators/userDecorators';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('User')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'))
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
    description: 'Are You Sure Wanna Delete.',
  })
  async delete(
    @Param('id') id: string,
    @UserDecorator() user: any,
  ): Promise<{ message: string }> {
    const userId = parseInt(id, 10);
    return this.userService.deleteUser(userId, user.sub);
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

  @Patch('restore/:id')
  async restoreUser(
    @Param('id') id: string,
    @UserDecorator() user: any
  ): Promise<{ message: string }> {
    const userId = parseInt(id, 10);
    return this.userService.restoreUser(userId, user.sub);
  }
}
