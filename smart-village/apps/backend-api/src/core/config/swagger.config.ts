import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Smart Village API')
  .setDescription('API documentation for Smart Village Platform')
  .setVersion('1.0')
  .addBearerAuth()
  .addTag('Auth')
  .addTag('Citizens')
  .addTag('Letters')
  .addTag('Complaints')
  .addTag('Dashboard')
  .build();

export const createSwaggerDocument = (app: any) => {
  return SwaggerModule.createDocument(app, swaggerConfig);
};

export const setupSwagger = (app: any) => {
  const document = createSwaggerDocument(app);
  SwaggerModule.setup('api/docs', app, document);
};
