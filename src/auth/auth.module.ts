import { Module } from '@nestjs/common'

import { JwtModule } from '@nestjs/jwt'

import { JwtStrategy } from './strategy/jwt.strategy'
import  AuthController  from './auth.controller'
import AuthService  from './auth.service'


@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy,],
  exports: [AuthService],
})
export default class AuthModule {}
