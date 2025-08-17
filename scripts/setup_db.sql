DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname='dogatlas') THEN
    CREATE ROLE dogatlas LOGIN PASSWORD 'dogatlas';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_database WHERE datname='dogatlas') THEN
    CREATE DATABASE dogatlas OWNER dogatlas;
  END IF;
END $$;

GRANT ALL PRIVILEGES ON DATABASE dogatlas TO dogatlas;
