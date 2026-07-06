import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { LoggingInterceptor } from '../src/common/interceptors/logging.interceptor';
import type { VercelRequest, VercelResponse } from '@vercel/node';

let cachedApp: any;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule, { bufferLogs: true, rawBody: true });

    const configService = app.get(ConfigService);

    // ── Security ──────────────────────────────────────────────────────────────
    app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: [`'self'`],
            scriptSrc: [`'self'`, `'unsafe-inline'`, 'cdn.jsdelivr.net', 'unpkg.com'],
            styleSrc: [`'self'`, `'unsafe-inline'`, 'cdn.jsdelivr.net', 'unpkg.com', 'fonts.googleapis.com'],
            imgSrc: [`'self'`, 'data:', 'cdn.jsdelivr.net'],
            fontSrc: [`'self'`, 'fonts.googleapis.com', 'fonts.gstatic.com'],
            connectSrc: [`'self'`],
          },
        },
      }),
    );
    app.enableCors({
      origin: configService.get<string>('FRONTEND_URL', 'http://localhost:3000'),
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    });

    // ── Global prefix ─────────────────────────────────────────────────────────
    app.setGlobalPrefix('api/v1');

    // ── Validation ────────────────────────────────────────────────────────────
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );

    // ── Serialization ─────────────────────────────────────────────────────────
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

    // ── Exception filter ──────────────────────────────────────────────────────
    app.useGlobalFilters(new HttpExceptionFilter());

    // ── Logging interceptor ───────────────────────────────────────────────────
    app.useGlobalInterceptors(new LoggingInterceptor());

    // ── Swagger ───────────────────────────────────────────────────────────────
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Beleqet API')
      .setDescription(
        'Beleqet Hiring Platform — Jobs Board, Freelance Marketplace, BeleqetSafe Escrow',
      )
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('auth', 'Authentication & session management')
      .addTag('users', 'User profile management')
      .addTag('jobs', 'Job listings & search')
      .addTag('applications', 'Job applications & workflow')
      .addTag('freelance', 'Freelance gigs, bids & contracts')
      .addTag('escrow', 'BeleqetSafe escrow & payments')
      .addTag('wallet', 'Freelancer wallet & withdrawals')
      .addTag('notifications', 'Notification management')
      .addTag('analytics', 'Platform analytics')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document, {
      customCssUrl: 'https://cdn.jsdelivr.net/npm/swagger-ui-dist/swagger-ui.css',
      customJs: [
        'https://cdn.jsdelivr.net/npm/swagger-ui-dist/swagger-ui-bundle.js',
        'https://cdn.jsdelivr.net/npm/swagger-ui-dist/swagger-ui-standalone-preset.js',
      ],
    });

    await app.init();
    cachedApp = app.getHttpAdapter().getInstance();
  }

  cachedApp(req, res);
}
