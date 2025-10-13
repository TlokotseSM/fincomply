import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USERNAME || 'fincomply_user',
  password: process.env.DATABASE_PASSWORD || 'fincomply_password',
  database: process.env.DATABASE_NAME || 'fincomply_db',
  schema: process.env.DATABASE_SCHEMA || 'public',
  entities: [join(__dirname, '..', 'entities', '*.entity{.ts,.js}')],
});

async function verifySchema() {
  try {
    console.log('🔍 Verifying database schema...\n');

    await AppDataSource.initialize();

    // Check tables
    const tables = await AppDataSource.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    console.log('📊 Tables created:');
    tables.forEach((table: any) => {
      console.log(`  ✓ ${table.table_name}`);
    });

    // Check currencies count
    const currenciesCount = await AppDataSource.query(
      'SELECT COUNT(*) as count FROM currencies'
    );
    console.log(`\n💰 Currencies: ${currenciesCount[0].count} records`);

    // Check countries count
    const countriesCount = await AppDataSource.query(
      'SELECT COUNT(*) as count FROM countries'
    );
    console.log(`🌍 Countries: ${countriesCount[0].count} records`);

    // Sample data
    const sampleCurrencies = await AppDataSource.query(
      'SELECT code, name, symbol FROM currencies LIMIT 5'
    );
    console.log('\n💵 Sample currencies:');
    sampleCurrencies.forEach((curr: any) => {
      console.log(`  ${curr.code} - ${curr.name} (${curr.symbol})`);
    });

    const sampleCountries = await AppDataSource.query(
      'SELECT code, name, currency_code FROM countries LIMIT 5'
    );
    console.log('\n🗺️  Sample countries:');
    sampleCountries.forEach((country: any) => {
      console.log(`  ${country.code} - ${country.name} (${country.currency_code})`);
    });

    // Check indexes
    const indexes = await AppDataSource.query(`
      SELECT 
        tablename,
        indexname
      FROM pg_indexes
      WHERE schemaname = 'public'
      AND indexname NOT LIKE '%pkey'
      ORDER BY tablename, indexname
      LIMIT 10;
    `);

    console.log('\n📇 Sample indexes:');
    indexes.forEach((idx: any) => {
      console.log(`  ${idx.tablename}.${idx.indexname}`);
    });

    // Check enum types
    const enums = await AppDataSource.query(`
      SELECT 
        t.typname as enum_name,
        string_agg(e.enumlabel, ', ' ORDER BY e.enumsortorder) as values
      FROM pg_type t 
      JOIN pg_enum e ON t.oid = e.enumtypid  
      JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
      WHERE n.nspname = 'public'
      GROUP BY t.typname
      ORDER BY t.typname;
    `);

    console.log('\n🏷️  Enum types:');
    enums.forEach((enumType: any) => {
      console.log(`  ${enumType.enum_name}`);
      console.log(`    Values: ${enumType.values}`);
    });

    // Check foreign keys
    const foreignKeys = await AppDataSource.query(`
      SELECT
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
      ORDER BY tc.table_name
      LIMIT 10;
    `);

    console.log('\n🔗 Sample foreign keys:');
    foreignKeys.forEach((fk: any) => {
      console.log(`  ${fk.table_name}.${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name}`);
    });

    console.log('\n✅ Schema verification completed successfully!');

    await AppDataSource.destroy();
  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  }
}

verifySchema();