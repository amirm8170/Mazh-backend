import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as basicAuth from 'express-basic-auth';
import { SwaggerInitConfig } from './config/swagger.config';
import { AuthGuard } from './auth/guards/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ allowedHeaders: '*', origin: '*' });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const authGuard = app.get(AuthGuard);

  app.useGlobalGuards(authGuard);

  SwaggerInitConfig(app);

  const swaggerUser = process.env.SWAGGER_USER;
  const swaggerPassword = process.env.SWAGGER_PASS;

  app.use(
    ['/swagger-backend-api'],
    basicAuth({
      challenge: true,
      users: {
        [swaggerUser]: swaggerPassword,
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
