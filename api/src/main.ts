import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api/');
  app.use(cookieParser());

  const cors_options = {
    origin: [
      "http://localhost:8080/",
      "https://signin.intra.42.fr/",
      "https://localhost:3000/",
      "https://localhost:3001/",
      "https://api.intra.42.fr/"
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true
  };

  app.enableCors(cors_options);

  const cors_options = {
    origin: ["http://localhost:8080/", "https://signin.intra.42.fr/", "http://localhost:3000/", "https://api.intra.42.fr/"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true
  };

  app.enableCors(cors_options);

  const config = new DocumentBuilder()
    .setTitle('API example')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('api')
    .addCookieAuth('Authentication')
    .build();

  const options: SwaggerDocumentOptions = {
    deepScanRoutes: true,
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('/api/', app, document);


  await app.listen(3000);
}
bootstrap();
