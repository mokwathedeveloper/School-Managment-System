import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as express from 'express';

const server = express();
let app;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(server),
    );
    
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
    }));
    
    await app.init();
  }
  return server;
}

export default async (req, res) => {
  await bootstrap();
  server(req, res);
};
