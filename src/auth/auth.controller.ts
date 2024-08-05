import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';
import AuthService from './auth.service';
import AuthDto from './dto/signupAuth.dto';
import UpdateAuthDto from './dto/signinAuth.dto';
import  AccessTokenResponse  from './accessTokenResponse';
import { RefreshTokenDto } from './dto/refreshtoken.dto';

@Controller('auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiCreatedResponse({
    description: 'Successful signup returns an access token',
    type: AccessTokenResponse,
  })
  async signup(@Body() dto: AuthDto): Promise<AccessTokenResponse> {
  return this.authService.signup(dto);
  }

  @Post('signin')
  @ApiResponse({
    description: 'Successful signin returns an access token',
    type: AccessTokenResponse,
  })
  async signin(@Body() dto: UpdateAuthDto): Promise<AccessTokenResponse> {
  return this.authService.signin(dto);
  }
  @Post('refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

}