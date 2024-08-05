import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import AuthModule from 'src/auth/auth.module';
import UserService from './user.service';
import UserController from './user.controller';

@Module({
  imports: [
    JwtModule.register({}), 
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export default class UserModule {}
