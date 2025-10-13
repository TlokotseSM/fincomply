import { AppDataSource } from '../data-source';

async function showMigrations() {
  try {
    console.log('🔄 Initializing database connection...');
    await AppDataSource.initialize();
    console.log('✅ Database connection established\n');

    const executed = await AppDataSource.showMigrations();

    if (executed) {
      console.log('✅ All migrations have been executed');
    } else {
      console.log('⚠️  Some migrations are pending');
    }

    await AppDataSource.destroy();
    console.log('\n👋 Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to show migrations:', error);
    process.exit(1);
  }
}

showMigrations();