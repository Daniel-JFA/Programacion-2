-- Script de estructura para PostgreSQL
-- Ejemplo de uso:
--   psql -U postgres -f estructura_bd_postgresql.sql
--
-- Si ya tienes creada la base de datos, puedes conectarte a ella y ejecutar
-- desde el bloque DO que crea el tipo hasta el final del archivo.

SELECT 'CREATE DATABASE "Dev_2"'
WHERE NOT EXISTS (
  SELECT 1
  FROM pg_database
  WHERE datname = 'Dev_2'
)\gexec

\connect Dev_2

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'estado_registro'
  ) THEN
    CREATE TYPE estado_registro AS ENUM ('Activo', 'Inactivo');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS operadores (
  id_operador INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  estado estado_registro NOT NULL DEFAULT 'Activo',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS servidores (
  id_servidor VARCHAR(50) PRIMARY KEY,
  descripcion VARCHAR(150) NULL,
  estado estado_registro NOT NULL DEFAULT 'Activo',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mediciones (
  id_medicion BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_servidor VARCHAR(50) NOT NULL,
  id_operador INTEGER NOT NULL,
  cpu NUMERIC(5,2) NOT NULL,
  temperatura NUMERIC(5,2) NOT NULL,
  energia NUMERIC(10,2) NOT NULL,
  estado estado_registro NOT NULL DEFAULT 'Activo',
  fecha_medicion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  observaciones VARCHAR(255) NULL,
  CONSTRAINT fk_mediciones_servidores
    FOREIGN KEY (id_servidor) REFERENCES servidores(id_servidor)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_mediciones_operadores
    FOREIGN KEY (id_operador) REFERENCES operadores(id_operador)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_operadores_updated_at ON operadores;
CREATE TRIGGER trg_operadores_updated_at
BEFORE UPDATE ON operadores
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_servidores_updated_at ON servidores;
CREATE TRIGGER trg_servidores_updated_at
BEFORE UPDATE ON servidores
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
