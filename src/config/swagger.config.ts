import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function SwaggerInitConfig(app: INestApplication): void {
  const document = new DocumentBuilder()
    .setTitle('Mazh-Api')
    .setDescription('Mazh Api Documentation')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    })
    .setVersion('1.0')
    .build();

  const documentFactory = SwaggerModule.createDocument(app, document);
  SwaggerModule.setup('/swagger-backend-api', app, documentFactory);
}
