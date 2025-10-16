import { DataSource } from 'typeorm';
import { Currency } from '../entities/currency.entity';
import { Country } from '../entities/country.entity';
import { User, UserRole, UserStatus } from '../entities/user.entity';
import { currenciesData } from './currencies.seed';
import { countriesData } from './countries.seed';
import * as dotenv from 'dotenv';
import { join } from 'path';
import * as bcrypt from 'bcrypt';

// Load environment variables
dotenv.config();

// Create data source
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USERNAME || 'fincomply_user',
  password: process.env.DATABASE_PASSWORD || 'fincomply_password',
  database: process.env.DATABASE_NAME || 'fincomply_db',
  schema: process.env.DATABASE_SCHEMA || 'public',
  entities: [join(__dirname, '..', 'entities', '*.entity{.ts,.js}')],
  synchronize: false,
  logging: false,
});

async function seedUsers(queryRunner: any) {
  console.log('👥 Seeding users...');
  
  const userRepository = queryRunner.manager.getRepository(User);
  const hashedPassword = await bcrypt.hash('SecurePassword123!@#', 10);

  const users = [
    {
      email: 'superadmin@fincomply.com',
      username: 'superadmin',
      firstName: 'Super',
      lastName: 'Admin',
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
    {
      email: 'admin@fincomply.com',
      username: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      password: hashedPassword,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
    {
      email: 'finance@fincomply.com',
      username: 'finance_manager',
      firstName: 'John',
      lastName: 'Finance',
      password: hashedPassword,
      role: UserRole.FINANCE_MANAGER,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
    {
      email: 'payroll@fincomply.com',
      username: 'payroll_officer',
      firstName: 'Jane',
      lastName: 'Payroll',
      password: hashedPassword,
      role: UserRole.PAYROLL_OFFICER,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
    {
      email: 'employee@fincomply.com',
      username: 'employee',
      firstName: 'Bob',
      lastName: 'Employee',
      password: hashedPassword,
      role: UserRole.EMPLOYEE,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  ];

  for (const userData of users) {
    const exists = await userRepository.findOne({
      where: { email: userData.email },
    });

    if (!exists) {
      const user = userRepository.create(userData);
      await userRepository.save(user);
      console.log(`  ✓ Created user: ${userData.email}`);
    } else {
      console.log(`  ⊘ User ${userData.email} already exists`);
    }
  }
}

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');

    // Initialize data source
    await AppDataSource.initialize();
    console.log('✅ Database connection established');

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Seed users (NEW)
      await seedUsers(queryRunner);

      // Seed currencies
      console.log('📦 Seeding currencies...');
      const currencyRepository = queryRunner.manager.getRepository(Currency);
      
      for (const currencyData of currenciesData) {
        const exists = await currencyRepository.findOne({
          where: { code: currencyData.code },
        });
        
        if (!exists) {
          const currency = currencyRepository.create(currencyData);
          await currencyRepository.save(currency);
          console.log(`  ✓ Created currency: ${currencyData.code}`);
        } else {
          console.log(`  ⊘ Currency ${currencyData.code} already exists`);
        }
      }

      // Seed countries
      console.log('📦 Seeding countries...');
      const countryRepository = queryRunner.manager.getRepository(Country);
      
      for (const countryData of countriesData) {
        const exists = await countryRepository.findOne({
          where: { code: countryData.code },
        });
        
        if (!exists) {
          const country = countryRepository.create(countryData);
          await countryRepository.save(country);
          console.log(`  ✓ Created country: ${countryData.name}`);
        } else {
          console.log(`  ⊘ Country ${countryData.code} already exists`);
        }
      }

      await queryRunner.commitTransaction();
      console.log('✅ Seeding completed successfully!');
      
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('❌ Error during seeding:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }

    await AppDataSource.destroy();
    console.log('👋 Database connection closed');
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the seed function
seed();