import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import PrismaService from 'src/prisma/prisma.service';
import UpdateAuthDto from './dto/signinAuth.dto';
import AuthDto from './dto/signupAuth.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import AccessTokenResponse from './accessTokenResponse';
import CustomErrorException from 'src/Comp/Erorr/CustomErrorException';


@Injectable()
export default class AuthService {
  private readonly saltRounds = 10;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(dto: AuthDto): Promise<AccessTokenResponse> {
    try {
      const hashedPassword = await bcrypt.hash(dto.password, this.saltRounds);
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          username: dto.username,
          fullname: dto.fullname,
        },
      });
      const accessToken = await this.generateAccessToken(user.id, user.email, user.username);
      return { access_token: accessToken };
    } catch (error) {
      CustomErrorException.handle(error, 'User signup');
    }
  }

  async signin(dto: UpdateAuthDto): Promise<AccessTokenResponse> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (!user || !(await bcrypt.compare(dto.password, user.password))) {
        throw new CustomErrorException('Invalid email or password', 401, 'Authentication');
      }
      const accessToken = await this.generateAccessToken(user.id, user.email, user.username);
      return { access_token: accessToken };
    } catch (error) {
      CustomErrorException.handle(error, 'User signin');
    }
  }

  private async generateAccessToken(userId: number, email: string, username: string): Promise<string> {
    const payload = { sub: userId, email, username };
    const secret = this.configService.get<string>('JWT_SECRET');
    return this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret,
    });
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<void> {
    try {
      const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
      if (!user) {
        throw new CustomErrorException('User with this email does not exist', 404, 'Forgot Password');
      }
      const token = await this.jwtService.signAsync(
        { userId: user.id },
        { secret: this.configService.get<string>('JWT_SECRET'), expiresIn: '1h' }
      );
      console.log(`Password reset token (send this to user's email): ${token}`);
      // Here you should send the token to the user's email.
    } catch (error) {
      CustomErrorException.handle(error, 'Forgot Password');
    }
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    try {
      const payload = await this.jwtService.verifyAsync(dto.token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      const user = await this.prisma.user.findUnique({ where: { id: payload.userId } });
      if (!user) {
        throw new CustomErrorException('User not found', 404, 'Reset Password');
      }
      const hashedPassword = await bcrypt.hash(dto.newPassword, this.saltRounds);
      await this.prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });
    } catch (error) {
      CustomErrorException.handle(error, 'Reset Password');
    }
  }
}
