import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export function setupSwagger(app: INestApplication): void {
  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle(configService.get('swagger.title'))
    .setDescription(configService.get('swagger.description'))
    .setVersion(configService.get('swagger.version'))
    .setContact(
      'FinComply Support',
      'https://fincomply.com',
      'tlokotsemogudi@gmail.com.com',
    )
    .setLicense('MIT', 'https://github.com/TlokotseSM/fincomply?tab=MIT-1-ov-file#readme')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Authentication', 'User authentication endpoints')
    .addTag('Employees', 'Employee management endpoints')
    .addTag('Companies', 'Company management endpoints')
    .addTag('Payroll', 'Payroll processing endpoints')
    .addTag('Compliance', 'Compliance tracking endpoints')
    .addTag('Tax', 'Tax calculation endpoints')
    .addTag('Currency', 'Currency and exchange rate endpoints')
    .addTag('Reports', 'Financial reporting endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(configService.get('swagger.path'), app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      deepLinking: true,
      displayOperationId: true,
    },
    customCss: `
      .topbar { display: none; }
      .swagger-ui .topbar-wrapper { display: none; }
      .swagger-ui .info .title { font-size: 2.5em; }
      .swagger-ui .scheme-container { background: #fafafa; }
    `,
    customSiteTitle: 'FinComply API Documentation',
  });
}