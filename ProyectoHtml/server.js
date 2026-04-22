const fs = require("fs/promises");
const path = require("path");
const express = require("express");
const mysql = require("mysql2/promise");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
const dbPort = Number.isFinite(Number(process.env.db_port))
  ? Number(process.env.db_port)
  : 3306;
const dbName = process.env.db_name;
const baseDbConfig = {
  host: process.env.db_host,
  port: dbPort,
  user: process.env.db_user,
  password: process.env.db_password
};

let pool;

const defaultOperators = [
  "Ana Perez",
  "Carlos Gomez",
  "Laura Martinez"
];

app.use(express.json());
app.use(express.static(__dirname));

function createPool() {
  return mysql.createPool({
    ...baseDbConfig,
    database: dbName,
    waitForConnections: true,
    connectionLimit: 10,
    namedPlaceholders: true
  });
}

function escapeIdentifier(identifier) {
  return `\`${String(identifier).replace(/`/g, "``")}\``;
}

async function ensureDatabaseSchema() {
  if (!dbName) {
    throw new Error("Falta definir db_name en el archivo .env.");
  }

  const schemaPath = path.join(__dirname, "estructura_bd.sql");
  const rawSchema = await fs.readFile(schemaPath, "utf8");
  const databaseIdentifier = escapeIdentifier(dbName);

  const schemaSql = rawSchema
    .replace(
      /CREATE DATABASE IF NOT EXISTS\s+[^\s;]+/i,
      `CREATE DATABASE IF NOT EXISTS ${databaseIdentifier}`
    )
    .replace(/USE\s+[^\s;]+;?/i, `USE ${databaseIdentifier};`);

  const connection = await mysql.createConnection({
    ...baseDbConfig,
    multipleStatements: true
  });

  try {
    await connection.query(schemaSql);
  } finally {
    await connection.end();
  }
}

function describeStartupError(error) {
  switch (error?.code) {
    case "ECONNREFUSED":
      return `No se pudo conectar a MySQL en ${baseDbConfig.host}:${baseDbConfig.port}. Verifica que el servicio esté iniciado.`;
    case "ER_ACCESS_DENIED_ERROR":
      return "MySQL rechazó el usuario o la contraseña configurados en .env.";
    case "ER_BAD_DB_ERROR":
      return `La base ${dbName} no existe y no se pudo crear automáticamente. Revisa permisos o el script estructura_bd.sql.`;
    default:
      return error?.message || "Error desconocido al iniciar el servidor.";
  }
}

async function ensureSeedData() {
  const [rows] = await pool.query("SELECT COUNT(*) AS total FROM operadores");

  if (rows[0].total === 0) {
    for (const nombre of defaultOperators) {
      await pool.query("INSERT INTO operadores (nombre, estado) VALUES (?, 'Activo')", [nombre]);
    }
  }
}

app.get("/api/operadores", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id_operador, nombre, estado FROM operadores ORDER BY nombre ASC"
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se pudieron cargar los usuarios." });
  }
});

app.get("/api/mediciones", async (req, res) => {
  const requestedAll = req.query.all === "1" || req.query.all === "true";
  const limit = Number(req.query.limit) || 50;
  const safeLimit = Math.min(Math.max(limit, 1), 200);

  try {
    const baseQuery = `SELECT
         m.id_medicion,
         m.id_servidor,
         m.id_operador,
         o.nombre AS operador,
         m.cpu,
         m.temperatura,
         m.energia,
         m.estado,
         m.fecha_medicion,
         m.observaciones
       FROM mediciones m
       INNER JOIN operadores o ON o.id_operador = m.id_operador
       ORDER BY m.id_medicion DESC`;

    const query = requestedAll ? baseQuery : `${baseQuery} LIMIT ?`;
    const params = requestedAll ? [] : [safeLimit];

    const [rows] = await pool.query(query, params);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se pudieron cargar las mediciones." });
  }
});

app.post("/api/mediciones", async (req, res) => {
  const { idServidor, idOperador, estado, cpu, temperatura, energia } = req.body;

  if (!idServidor || !idOperador || !estado) {
    return res.status(400).json({ error: "Faltan campos obligatorios." });
  }

  if (![cpu, temperatura, energia].every((value) => typeof value === "number" && !Number.isNaN(value))) {
    return res.status(400).json({ error: "CPU, temperatura y energia deben ser numéricos." });
  }

  if (!['Activo', 'Inactivo'].includes(estado)) {
    return res.status(400).json({ error: "El estado debe ser Activo o Inactivo." });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.query(
      "INSERT INTO servidores (id_servidor, estado) VALUES (?, 'Activo') ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP",
      [idServidor]
    );

    const [operadorRows] = await connection.query(
      "SELECT id_operador FROM operadores WHERE id_operador = ?",
      [idOperador]
    );

    if (operadorRows.length === 0) {
      throw new Error("El usuario seleccionado no existe.");
    }

    await connection.query(
      `INSERT INTO mediciones (id_servidor, id_operador, cpu, temperatura, energia, estado)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [idServidor, idOperador, cpu, temperatura, energia, estado]
    );

    await connection.commit();
    res.status(201).json({ message: "Medición guardada correctamente." });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ error: error.message || "No se pudo guardar la medición." });
  } finally {
    connection.release();
  }
});

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error" });
  }
});

async function start() {
  await ensureDatabaseSchema();
  pool = createPool();
  await ensureSeedData();

  app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error("No se pudo iniciar el servidor:", describeStartupError(error));
  console.error(error);
  process.exit(1);
});
