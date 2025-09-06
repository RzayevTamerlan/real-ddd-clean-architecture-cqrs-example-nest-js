import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionsFilter } from '@shared/application/filters/global-exception.filter';
import { TrimPipe } from '@shared/application/pipes/trim.pipe';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.WEB_API_PORT || 8080;
  const host = process.env.HOST || 'local';

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.useGlobalPipes(new TrimPipe());

  if (host === 'local') {
    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Accept',
        'X-Requested-With',
        'X-Forwarded-For',
        'X-Real-IP',
      ],
      credentials: true,
    });

    const config = new DocumentBuilder()
      .setTitle('Aga Mastery API')
      .setDescription('API documentation for Aga Mastery application')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          in: 'header',
        },
        'access-token',
      )
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  } else {
    const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || '').split(',');
    app.enableCors({
      origin: allowedOrigins,
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Accept',
        'X-Requested-With',
        'X-Forwarded-For',
        'X-Real-IP',
      ],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });
  }

  app.useGlobalFilters(new GlobalExceptionsFilter());

  await app.listen(port, () => {
    console.log(`Server is running on port - ${port}. Host - ${host}`);
    if (host === 'local') {
      console.log(`Swagger is running at http://localhost:${port}/api/docs`);
    }
  });
}

bootstrap();
