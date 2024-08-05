import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import PostModule from './post/post.module'
import ProfileModule from './profile/profile.module'
import PrismaModule from './prisma/prisma.module'
import AuthModule from './auth/auth.module'
import UserModule from './user/user.module'
import AppController from './app.controller'
import AppService from './app.service'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    PrismaModule,
    ProfileModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export default class AppModule {}
