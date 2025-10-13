import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

async function quickVerify() {
  const client = new Client({
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    user: process.env.DATABASE_USERNAME || 'fincomply_user',
    password: process.env.DATABASE_PASSWORD || 'fincomply_password',
    database: process.env.DATABASE_NAME || 'fincomply_db',
  });

  try {
    console.log('🔍 Quick database verification...\n');
    await client.connect();
    console.log('✅ Connected to database\n');

    // Check tables
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      AND table_name != 'migrations'
      ORDER BY table_name;
    `);

    console.log('📊 Tables created:');
    tables.rows.forEach((row) => {
      console.log(`  ✓ ${row.table_name}`);
    });

    // Check currencies
    const currencies = await client.query('SELECT COUNT(*) FROM currencies');
    console.log(`\n💰 Currencies: ${currencies.rows[0].count} records`);

    // Check countries
    const countries = await client.query('SELECT COUNT(*) FROM countries');
    console.log(`🌍 Countries: ${countries.rows[0].count} records`);

    // Sample currencies
    const sampleCurrencies = await client.query(
      'SELECT code, name, symbol FROM currencies LIMIT 5'
    );
    console.log('\n💵 Sample currencies:');
    sampleCurrencies.rows.forEach((curr) => {
      console.log(`  ${curr.code} - ${curr.name} (${curr.symbol})`);
    });

    // Sample countries
    const sampleCountries = await client.query(
      'SELECT code, name, currency_code FROM countries LIMIT 5'
    );
    console.log('\n🗺️  Sample countries:');
    sampleCountries.rows.forEach((country) => {
      console.log(`  ${country.code} - ${country.name} (${country.currency_code})`);
    });

    // Check migrations
    const migrations = await client.query(
      'SELECT name FROM migrations ORDER BY timestamp'
    );
    console.log('\n📋 Migrations run:');
    migrations.rows.forEach((migration) => {
      console.log(`  ✓ ${migration.name}`);
    });

    console.log('\n✅ Quick verification completed successfully!');
    await client.end();
  } catch (error) {
    console.error('❌ Verification failed:', error);
    await client.end();
    process.exit(1);
  }
}

quickVerify();