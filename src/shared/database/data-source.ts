import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config();

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USERNAME || 'fincomply_user',
  password: process.env.DATABASE_PASSWORD || 'fincomply_password',
  database: process.env.DATABASE_NAME || 'fincomply_db',
  schema: process.env.DATABASE_SCHEMA || 'public',
  entities: [join(__dirname, 'entities', '*.entity{.ts,.js}')],
  migrations: [join(__dirname, 'migrations', '*{.ts,.js}')],
  synchronize: false, // Never use true in production
  logging: process.env.DATABASE_LOGGING === 'true',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};

export const AppDataSource = new DataSource(dataSourceOptions);

// Initialize the data source (for scripts)
export default AppDataSource;