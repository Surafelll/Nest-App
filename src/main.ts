import { NestFactory } from '@nestjs/core'
import { Logger, ValidationPipe } from '@nestjs/common'
import { WinstonModule } from 'nest-winston'
import { ConfigService } from '@nestjs/config'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import winstonLoggerInstance from './utils/logger/winston.logger'
import AppModule from './app.module'
import GlobalHttpExceptionFilter from './Comp/exception-filters/exception.filter'



async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({ instance: winstonLoggerInstance }),
  })
  const logger = new Logger()
  const configService = app.get(ConfigService)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  )

  app.useGlobalFilters(new GlobalHttpExceptionFilter())
  app.setGlobalPrefix('api')

  const config = new DocumentBuilder()
    .setTitle('Posts example')
    .setDescription('The Posts  API description')
    .setVersion('1.0')
    .addTag('posts')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('swagger', app, document)

  await app.listen(configService.get<number>('APP_PORT') || 3000, async () =>
    logger.verbose(`Application running at: ${await app.getUrl()}`),
  )
}

bootstrap()
