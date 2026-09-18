import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

import { join } from 'path';

const expressApp = express();
// Serve the uploads folder statically
expressApp.use('/public/uploads', express.static(join(process.cwd(), 'uploads')));

let cachedServer: any;

async function bootstrap() {
  if (!cachedServer) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );
    app.enableCors();
    
    // Increase JSON body payload size for Base64 image uploads
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '50mb', extended: true }));

    await app.init();
    cachedServer = expressApp;
  }
  return cachedServer;
}

if (!process.env.VERCEL) {
  bootstrap().then((app) => {
    app.listen(process.env.PORT ?? 3001, '0.0.0.0', () => {
      console.log('Backend is running on port ' + (process.env.PORT ?? 3001));
    });
  });
}

// Export for Vercel Serverless
export default async function handler(req: any, res: any) {
  const server = await bootstrap();
  return server(req, res);
}
