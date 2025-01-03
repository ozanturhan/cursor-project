import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );

  // Get ConfigService to access environment variables
  const configService = app.get(ConfigService);

  // Log environment variables (DEVELOPMENT ONLY)
  if (configService.get('NODE_ENV') === 'development') {
    console.log('🔍 Environment Variables:');
    const envVarsToLog = [
      'EMAIL_HOST', 
      'EMAIL_PORT', 
      'EMAIL_SECURE', 
      'EMAIL_FROM', 
      'SUPPORT_EMAIL', 
      'FRONTEND_URL', 
      'NODE_ENV', 
      'PORT'
    ];

    envVarsToLog.forEach(key => {
      console.log(`${key}: ${configService.get(key) || 'Not set'}`);
    });
  }

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Consultation API')
    .setDescription('The consultation platform API description')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('bookings', 'Booking management endpoints')
    .addBearerAuth()
    .addServer('http://localhost:3001', 'Local development')
    .addServer('https://api.consultation-platform.com', 'Production')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // Save the OpenAPI spec as JSON file
  const swaggerDir = join(process.cwd(), 'src/swagger');
  if (!existsSync(swaggerDir)) {
    mkdirSync(swaggerDir, { recursive: true });
  }
  
  const outputPath = join(swaggerDir, 'openapi.json');
  writeFileSync(outputPath, JSON.stringify(document, null, 2));
  console.log(`OpenAPI specification has been saved to: ${outputPath}`);

  SwaggerModule.setup('api', app, document);

  const port = configService.get('PORT', 3001);
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger UI is available at: http://localhost:${port}/api`);
}
bootstrap();
