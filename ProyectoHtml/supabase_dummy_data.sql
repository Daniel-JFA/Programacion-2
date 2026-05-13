-- Ejecuta este script despues de supabase_setup.sql
-- en el SQL Editor de Supabase.
--
-- Objetivo:
-- - Crear servidores de prueba
-- - Insertar mediciones dummy realistas
-- - Permitir reejecucion sin duplicar datos

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'operadores') THEN
    RAISE EXCEPTION 'La tabla operadores no existe. Ejecuta primero supabase_setup.sql';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'servidores') THEN
    RAISE EXCEPTION 'La tabla servidores no existe. Ejecuta primero supabase_setup.sql';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'mediciones') THEN
    RAISE EXCEPTION 'La tabla mediciones no existe. Ejecuta primero supabase_setup.sql';
  END IF;
END $$;

-- Garantiza operadores base si todavia no existen
INSERT INTO operadores (nombre, estado)
SELECT 'Ana Perez', 'Activo'
WHERE NOT EXISTS (
  SELECT 1 FROM operadores WHERE nombre = 'Ana Perez'
);

INSERT INTO operadores (nombre, estado)
SELECT 'Carlos Gomez', 'Activo'
WHERE NOT EXISTS (
  SELECT 1 FROM operadores WHERE nombre = 'Carlos Gomez'
);

INSERT INTO operadores (nombre, estado)
SELECT 'Laura Martinez', 'Activo'
WHERE NOT EXISTS (
  SELECT 1 FROM operadores WHERE nombre = 'Laura Martinez'
);

INSERT INTO operadores (nombre, estado)
SELECT 'Miguel Torres', 'Activo'
WHERE NOT EXISTS (
  SELECT 1 FROM operadores WHERE nombre = 'Miguel Torres'
);

INSERT INTO operadores (nombre, estado)
SELECT 'Sofia Ramirez', 'Activo'
WHERE NOT EXISTS (
  SELECT 1 FROM operadores WHERE nombre = 'Sofia Ramirez'
);

-- Limpia solamente el set dummy anterior para permitir reejecucion
DELETE FROM mediciones
WHERE id_servidor LIKE 'SRV-DUMMY-%';

DELETE FROM servidores
WHERE id_servidor LIKE 'SRV-DUMMY-%';

INSERT INTO servidores (id_servidor, descripcion, estado)
VALUES
  ('SRV-DUMMY-01', 'Servidor web principal de pruebas', 'Activo'),
  ('SRV-DUMMY-02', 'Servidor de base de datos de pruebas', 'Activo'),
  ('SRV-DUMMY-03', 'Servidor de reportes y analitica', 'Activo'),
  ('SRV-DUMMY-04', 'Servidor de respaldo automatizado', 'Activo'),
  ('SRV-DUMMY-05', 'Nodo batch para procesos nocturnos', 'Inactivo'),
  ('SRV-DUMMY-06', 'Servidor legado bajo observacion', 'Activo');

WITH operadores_seed AS (
  SELECT
    id_operador,
    ROW_NUMBER() OVER (ORDER BY id_operador) AS rn
  FROM operadores
),
timeline AS (
  SELECT generate_series(0, 35) AS idx
),
server_catalog AS (
  SELECT *
  FROM (
    VALUES
      ('SRV-DUMMY-01', 52.0, 41.0, 245.0, 'Activo', 'Operacion estable en horario diurno'),
      ('SRV-DUMMY-02', 68.0, 48.0, 310.0, 'Activo', 'Carga sostenida por procesos de datos'),
      ('SRV-DUMMY-03', 74.0, 55.0, 355.0, 'Activo', 'Reporte intensivo con picos moderados'),
      ('SRV-DUMMY-04', 36.0, 39.0, 180.0, 'Activo', 'Respaldo en ventana controlada'),
      ('SRV-DUMMY-05', 12.0, 31.0, 90.0, 'Inactivo', 'Nodo detenido para mantenimiento'),
      ('SRV-DUMMY-06', 83.0, 72.0, 402.0, 'Activo', 'Equipo legado con consumo elevado')
  ) AS t(id_servidor, base_cpu, base_temp, base_energia, estado, nota)
)
INSERT INTO mediciones (
  id_servidor,
  id_operador,
  cpu,
  temperatura,
  energia,
  estado,
  fecha_medicion,
  observaciones
)
SELECT
  sc.id_servidor,
  COALESCE(op.id_operador, fallback.id_operador) AS id_operador,
  ROUND(
    LEAST(
      99.5,
      GREATEST(
        1.0,
        sc.base_cpu
        + ((t.idx % 6) * 2.75)
        - ((t.idx % 4) * 1.10)
      )
    )::numeric,
    2
  ) AS cpu,
  ROUND(
    LEAST(
      95.0,
      GREATEST(
        18.0,
        sc.base_temp
        + ((t.idx % 5) * 1.85)
        - ((t.idx % 3) * 0.60)
      )
    )::numeric,
    2
  ) AS temperatura,
  ROUND(
    LEAST(
      650.0,
      GREATEST(
        45.0,
        sc.base_energia
        + ((t.idx % 7) * 12.5)
        - ((t.idx % 4) * 4.0)
      )
    )::numeric,
    2
  ) AS energia,
  CASE
    WHEN sc.id_servidor = 'SRV-DUMMY-05' THEN 'Inactivo'::estado_registro
    WHEN sc.id_servidor = 'SRV-DUMMY-06' AND t.idx % 5 = 0 THEN 'Inactivo'::estado_registro
    ELSE sc.estado::estado_registro
  END AS estado,
  CURRENT_TIMESTAMP - ((35 - t.idx) * INTERVAL '2 hour') AS fecha_medicion,
  CASE
    WHEN sc.id_servidor = 'SRV-DUMMY-06' AND t.idx % 4 = 0 THEN
      'Dato dummy: consumo alto detectado, revisar ventilacion.'
    WHEN sc.id_servidor = 'SRV-DUMMY-05' THEN
      'Dato dummy: servidor en mantenimiento programado.'
    ELSE
      'Dato dummy: ' || sc.nota
  END AS observaciones
FROM server_catalog sc
CROSS JOIN timeline t
LEFT JOIN operadores_seed op
  ON op.rn = ((t.idx % 5) + 1)
CROSS JOIN LATERAL (
  SELECT id_operador
  FROM operadores
  ORDER BY id_operador
  LIMIT 1
) AS fallback;

-- Resumen rapido para verificar la carga
SELECT
  (SELECT COUNT(*) FROM operadores) AS total_operadores,
  (SELECT COUNT(*) FROM servidores WHERE id_servidor LIKE 'SRV-DUMMY-%') AS total_servidores_dummy,
  (SELECT COUNT(*) FROM mediciones WHERE id_servidor LIKE 'SRV-DUMMY-%') AS total_mediciones_dummy;
