export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  app: {
    name: process.env.APP_NAME || 'FinComply',
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  },
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USERNAME || 'fincomply_user',
    password: process.env.DATABASE_PASSWORD || 'fincomply_password',
    database: process.env.DATABASE_NAME || 'fincomply_db',
    schema: process.env.DATABASE_SCHEMA || 'public',
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    logging: process.env.DATABASE_LOGGING === 'true',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD || '',
    db: parseInt(process.env.REDIS_DB, 10) || 0,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'change-me-in-production',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'change-me-in-production',
    expiresIn: process.env.JWT_EXPIRATION || '3600s',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },
  swagger: {
    title: process.env.SWAGGER_TITLE || 'FinComply API',
    description: process.env.SWAGGER_DESCRIPTION || 'Financial Management API',
    version: process.env.SWAGGER_VERSION || '1.0.0',
    path: process.env.SWAGGER_PATH || 'api',
  },
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS, 10) || 12,
    rateLimitTTL: parseInt(process.env.RATE_LIMIT_TTL, 10) || 60,
    rateLimitMax: parseInt(process.env.RATE_LIMIT_LIMIT, 10) || 100,
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
});