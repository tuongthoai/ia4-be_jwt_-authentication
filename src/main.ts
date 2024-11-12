import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { INestApplication } from '@nestjs/common';

async function bootstrap() {
  const corsOptions = {
    origin: 'https://ia4-fe-jwt-authentication.onrender.com',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials: true,
  };
  const app: INestApplication<any> = await NestFactory.create(AppModule);
  app.enableCors(corsOptions);
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
