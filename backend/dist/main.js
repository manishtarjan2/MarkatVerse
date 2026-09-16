import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { join } from 'path';
const expressApp = express();
expressApp.use('/public/uploads', express.static(join(process.cwd(), 'uploads')));
let cachedServer;
async function bootstrap() {
    if (!cachedServer) {
        const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
        app.enableCors();
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
export default async function handler(req, res) {
    const server = await bootstrap();
    return server(req, res);
}
//# sourceMappingURL=main.js.map