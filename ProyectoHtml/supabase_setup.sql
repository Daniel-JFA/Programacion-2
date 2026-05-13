-- Ejecuta este script en el SQL Editor de Supabase.
-- Crea la estructura base, inserta operadores por defecto
-- y habilita politicas RLS simples para este proyecto academico.

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

INSERT INTO operadores (nombre, estado)
SELECT 'Ana Perez', 'Activo'
WHERE NOT EXISTS (
  SELECT 1
  FROM operadores
  WHERE nombre = 'Ana Perez'
);

INSERT INTO operadores (nombre, estado)
SELECT 'Carlos Gomez', 'Activo'
WHERE NOT EXISTS (
  SELECT 1
  FROM operadores
  WHERE nombre = 'Carlos Gomez'
);

INSERT INTO operadores (nombre, estado)
SELECT 'Laura Martinez', 'Activo'
WHERE NOT EXISTS (
  SELECT 1
  FROM operadores
  WHERE nombre = 'Laura Martinez'
);

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE ON TABLE operadores TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE ON TABLE servidores TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE ON TABLE mediciones TO anon, authenticated, service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

ALTER TABLE operadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE servidores ENABLE ROW LEVEL SECURITY;
ALTER TABLE mediciones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS operadores_select_all ON operadores;
CREATE POLICY operadores_select_all
ON operadores
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS operadores_insert_all ON operadores;
CREATE POLICY operadores_insert_all
ON operadores
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS operadores_update_all ON operadores;
CREATE POLICY operadores_update_all
ON operadores
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS servidores_select_all ON servidores;
CREATE POLICY servidores_select_all
ON servidores
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS servidores_insert_all ON servidores;
CREATE POLICY servidores_insert_all
ON servidores
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS servidores_update_all ON servidores;
CREATE POLICY servidores_update_all
ON servidores
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS mediciones_select_all ON mediciones;
CREATE POLICY mediciones_select_all
ON mediciones
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS mediciones_insert_all ON mediciones;
CREATE POLICY mediciones_insert_all
ON mediciones
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS mediciones_update_all ON mediciones;
CREATE POLICY mediciones_update_all
ON mediciones
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);
