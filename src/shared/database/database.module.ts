import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Import entities explicitly (not enums)
import { BaseEntity } from './entities/base.entity';
import { Country } from './entities/country.entity';
import { Currency } from './entities/currency.entity';
import { Company } from './entities/company.entity';
import { Employee } from './entities/employee.entity';
import { Contract } from './entities/contract.entity';
import { Payrun } from './entities/payrun.entity';
import { Payment } from './entities/payment.entity';
import { TaxRule } from './entities/tax-rule.entity';
import { TaxLiability } from './entities/tax-liability.entity';
import { ComplianceDocument } from './entities/compliance-document.entity';
import { ExchangeRate } from './entities/exchange-rate.entity';

const entities = [
  Country,
  Currency,
  Company,
  Employee,
  Contract,
  Payrun,
  Payment,
  TaxRule,
  TaxLiability,
  ComplianceDocument,
  ExchangeRate,
];

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        schema: configService.get('database.schema'),
        entities: entities,
        synchronize: false, // Always use migrations in production
        logging: configService.get('database.logging'),
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}