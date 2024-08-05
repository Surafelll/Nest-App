import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import PrismaService from 'src/prisma/prisma.service';
import UpdateAuthDto from './dto/signinAuth.dto';
import AuthDto from './dto/signupAuth.dto';
import { RefreshTokenDto } from './dto/refreshtoken.dto';

@Injectable()
export default class AuthService {
  private readonly saltRounds = 10;
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async signup(dto: AuthDto): Promise<{ access_token: string }> {
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
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('Credentials already taken');
      }
      throw new Error('An error occurred while creating the user');
    }
  }
  async signin(dto: UpdateAuthDto): Promise<{ access_token: string }> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (!user) {
        throw new UnauthorizedException('Credentials incorrect');
      }
      const isPasswordValid = await bcrypt.compare(dto.password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Credentials incorrect');
      }
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new Error('An error occurred while signing in');
    }
  }
  

  private async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = { sub: userId, email };
    const secret = this.configService.get<string>('JWT_SECRET');
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret,
    });
    return { access_token: token };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;
    
  }
}
