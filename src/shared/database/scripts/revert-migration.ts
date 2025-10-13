import { AppDataSource } from '../data-source';

async function revertMigration() {
  try {
    console.log('🔄 Initializing database connection...');
    await AppDataSource.initialize();
    console.log('✅ Database connection established');

    console.log('🔄 Reverting last migration...');
    await AppDataSource.undoLastMigration({ transaction: 'all' });
    console.log('✅ Successfully reverted last migration');

    await AppDataSource.destroy();
    console.log('👋 Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Revert failed:', error);
    process.exit(1);
  }
}

revertMigration();