-- Create database if not exists
CREATE DATABASE fincomply_db;

-- Create user if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'fincomply_user') THEN
    CREATE ROLE fincomply_user LOGIN PASSWORD 'fincomply_password';
  END IF;
END
$$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE fincomply_db TO fincomply_user;

-- Create extensions
\c fincomply_db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";