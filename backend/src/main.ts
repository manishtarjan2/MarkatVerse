import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const expressApp = express();
let cachedServer: any;

async function bootstrap() {
  if (!cachedServer) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );
    app.enableCors();
    await app.init();
    cachedServer = expressApp;
  }
  return cachedServer;
}

if (!process.env.VERCEL) {
  bootstrap().then((app) => {
    app.listen(process.env.PORT ?? 3001, () => {
      console.log('Backend is running on port ' + (process.env.PORT ?? 3001));
    });
  });
}

// Export for Vercel Serverless
export default async function handler(req: any, res: any) {
  const server = await bootstrap();
  return server(req, res);
}
