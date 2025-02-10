import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { json } from 'express';
import { GlobalExceptionFilter } from './utils/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  const configService = app.get(ConfigService);

  const enableCors = configService.get<boolean>('ENABLE_CORS');
  const port = configService.get<number>('PORT');

  // if (enableCors) {s
  app.enableCors();
  app.use(json({ limit: '50mb' }));
  // }
  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());

  const config = new DocumentBuilder() //SWAGGER
    .setTitle('API')
    .setDescription('API for RESUME APP')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'refresh-token')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); //localhost:3000/docs | localhost:8080/docs to get info of the API

  await app.listen(port || 3000);
}
bootstrap();
