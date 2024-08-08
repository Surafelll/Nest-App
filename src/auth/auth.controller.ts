import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import AuthService from './auth.service';
import AuthDto from './dto/signupAuth.dto';
import UpdateAuthDto from './dto/signinAuth.dto';
import AccessTokenResponse from './accessTokenResponse';
import { ResetPasswordDto } from './dto/reset-password.dto';
import CreatedUser from 'src/user/createdUserResponse';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { NotDeletedUserGuard } from './User Guard/NotDeletedUserGuard';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth')
@Controller('auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Post('signup')
  @ApiResponse({
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            user: { $ref: getSchemaPath(CreatedUser) },
            access_token: { $ref: getSchemaPath(AccessTokenResponse) },
          },
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Successful signup returns an access token',
    type: AccessTokenResponse,
  })
  async signup(@Body() dto: AuthDto): Promise<AccessTokenResponse> {
    return this.authService.signup(dto);
   
  }

  @Post('signin')
  @ApiResponse({
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            user: { $ref: getSchemaPath(CreatedUser) },
            access_token: { $ref: getSchemaPath(AccessTokenResponse) },
          },
        },
      },
    },
  })
  @ApiResponse({
    description: 'Successful signin returns an access token',
    type: AccessTokenResponse,
  })
  async signin(@Body() dto: UpdateAuthDto): Promise<AccessTokenResponse> {
    return this.authService.signin(dto);
  }
  @ApiBearerAuth('JWT-auth')
  @UseGuards(NotDeletedUserGuard)
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.authService.forgotPassword(forgotPasswordDto);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(NotDeletedUserGuard)
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDto);
    return { message: 'Password has been successfully reset.' };
  }
}
