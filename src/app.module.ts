import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequestContextMiddleware } from './utils/request-context.middleware';
import SnakeNamingStrategy from './database/typeorm-snake-case';
import { SoftDeleteSubscriber } from './utils/soft-delete.subscriber';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigType } from '@nestjs/config';
import * as Joi from 'joi';
import { environments } from './environments';
import config from './config';
import { UsersModule } from './endpoints/users/users.module';
import { AuthModule } from './endpoints/auth/auth.module';
import { UserSkillsModule } from './endpoints/user-skills/user-skills.module';
import { UserExperiencesModule } from './endpoints/user-experiences/user-experiences.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ResumeService } from './endpoints/users/resume.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: environments[process.env.RESUME_NODE_ENV || 'prod'],
      load: [config],
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        ACCESS_TOKEN_EXPIRATION: Joi.string().required(),
        REFRESH_TOKEN_EXPIRATION: Joi.string().required(),
      }),
      validationOptions: {
        abortEarly: true, //when true, stops validation on the first error, otherwise returns all the errors found. Defaults to true.
      },
    }),
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        return {
          type: 'postgres',
          host: configService.postgres.host,
          port: configService.postgres.port,
          database: configService.postgres.name,
          username: configService.postgres.user,
          password: configService.postgres.password,
          autoLoadEntities: true,
          keepConnectionAlive: true,
          synchronize: true,
          namingStrategy: new SnakeNamingStrategy(),
          subscribers: [SoftDeleteSubscriber],
        };
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'dist', 'public'),
      serveRoot: '/',
    }),
    UsersModule,
    AuthModule,
    UserSkillsModule,
    UserExperiencesModule
  ],
  controllers: [AppController],
  providers: [AppService, ResumeService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}