import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  app.use(cookieParser(configService.get<string>('COOKIE_SECRET')));
  const port: number = configService.get<number>('PORT', 3000);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
