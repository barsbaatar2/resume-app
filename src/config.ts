import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    database: {
      port: process.env.DATABASE_PORT,
    },
    postgres: {
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
      name: process.env.POSTGRES_NAME,
      password: process.env.POSTGRES_PASSWORD,
      user: process.env.POSTGRES_USER,
    },
    jwt: {
      jwtSecret: process.env.JWT_SECRET,
      jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
      refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION,
      accessTokenExpiration: process.env.ACCESS_TOKEN_EXPIRATION,
    },
    smtp: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      password: process.env.SMTP_PASSWORD,
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
    },
  };
});
