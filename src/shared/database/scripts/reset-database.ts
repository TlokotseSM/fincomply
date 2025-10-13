import { AppDataSource } from '../data-source';

async function resetDatabase() {
  try {
    console.log('⚠️  WARNING: This will DROP all tables and data!');
    console.log('🔄 Initializing database connection...');
    
    await AppDataSource.initialize();
    console.log('✅ Database connection established');

    console.log('🗑️  Dropping schema...');
    await AppDataSource.dropDatabase();
    console.log('✅ Schema dropped');

    console.log('🔄 Running migrations...');
    await AppDataSource.runMigrations({ transaction: 'all' });
    console.log('✅ Migrations completed');

    await AppDataSource.destroy();
    console.log('👋 Database connection closed');
    console.log('\n✅ Database reset completed successfully!');
    console.log('💡 Run "npm run seed" to populate with initial data');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Reset failed:', error);
    process.exit(1);
  }
}

resetDatabase();