const express = require("express");
const mysql = require("mysql2/promise");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();
const port = Number(process.env.PORT) || 3000;

const rawDbType = String(process.env.db_type || process.env.DB_TYPE || "").toLowerCase();
const dbHost = process.env.db_host;
const dbUser = process.env.db_user;
const dbPassword = process.env.db_password;
const dbName = process.env.db_name;
const dbPort = Number.isFinite(Number(process.env.db_port))
  ? Number(process.env.db_port)
  : 3306;

const supabaseProjectRef =
  process.env.SUPABASE_PROJECT_REF ||
  (dbHost && dbHost.match(/^db\.([^.]+)\.supabase\.co$/)?.[1]) ||
  "";
const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  (supabaseProjectRef ? `https://${supabaseProjectRef}.supabase.co` : "");
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  (rawDbType === "supabase" && String(dbPassword || "").startsWith("sb_") ? dbPassword : "");
const useSupabase =
  rawDbType === "supabase" ||
  Boolean(supabaseUrl && supabaseKey);

let mysqlPool;
let supabase;

const defaultOperators = [
  "Ana Perez",
  "Carlos Gomez",
  "Laura Martinez"
];

app.use(express.json());
app.use(express.static(__dirname));

function createMysqlPool() {
  return mysql.createPool({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    database: dbName,
    waitForConnections: true,
    connectionLimit: 10,
    namedPlaceholders: true
  });
}

function createSupabaseClient() {
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

function validateDatabaseConfig() {
  const missing = [];

  if (useSupabase) {
    if (!supabaseUrl) {
      missing.push("SUPABASE_URL");
    }

    if (!supabaseKey) {
      missing.push("SUPABASE_PUBLISHABLE_KEY, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY o SUPABASE_ANON_KEY");
    }
  } else {
    if (!dbHost) {
      missing.push("db_host");
    }

    if (!dbUser) {
      missing.push("db_user");
    }

    if (!dbName) {
      missing.push("db_name");
    }
  }

  if (missing.length > 0) {
    throw new Error(`Faltan variables de entorno: ${missing.join(", ")}`);
  }
}

function describeSupabaseError(error) {
  const message = String(error?.message || "");

  if (error?.code === "42P01" || /does not exist/i.test(message)) {
    return "Las tablas de Supabase no existen todavia. Ejecuta supabase_setup.sql en el SQL Editor de Supabase.";
  }

  if (error?.code === "42501" || /permission denied|row-level security/i.test(message)) {
    return "Supabase respondio, pero la key actual no tiene permisos sobre las tablas. Ejecuta supabase_setup.sql o revisa las policies RLS.";
  }

  if (error?.status === 401 || error?.status === 403 || /invalid api key|jwt/i.test(message)) {
    return "La key de Supabase no es valida para esta API.";
  }

  if (message) {
    return message;
  }

  return "Error desconocido al conectar con Supabase.";
}

async function ensureSeedDataMysql() {
  const [rows] = await mysqlPool.query("SELECT COUNT(*) AS total FROM operadores");

  if (rows[0].total === 0) {
    for (const nombre of defaultOperators) {
      await mysqlPool.query(
        "INSERT INTO operadores (nombre, estado) VALUES (?, 'Activo')",
        [nombre]
      );
    }
  }
}

async function ensureSeedDataSupabase() {
  const countResponse = await supabase
    .from("operadores")
    .select("id_operador", { count: "exact", head: true });

  if (countResponse.error) {
    throw new Error(describeSupabaseError(countResponse.error));
  }

  if ((countResponse.count || 0) > 0) {
    return;
  }

  const insertResponse = await supabase
    .from("operadores")
    .insert(
      defaultOperators.map((nombre) => ({
        nombre,
        estado: "Activo"
      }))
    );

  if (insertResponse.error) {
    throw new Error(describeSupabaseError(insertResponse.error));
  }
}

async function ensureSeedData() {
  if (useSupabase) {
    await ensureSeedDataSupabase();
    return;
  }

  await ensureSeedDataMysql();
}

async function loadOperators() {
  if (useSupabase) {
    const response = await supabase
      .from("operadores")
      .select("id_operador, nombre, estado")
      .order("nombre", { ascending: true });

    if (response.error) {
      throw new Error(describeSupabaseError(response.error));
    }

    return response.data || [];
  }

  const [rows] = await mysqlPool.query(
    "SELECT id_operador, nombre, estado FROM operadores ORDER BY nombre ASC"
  );

  return rows;
}

function mapSupabaseMeasurements(rows) {
  return (rows || []).map((row) => ({
    id_medicion: row.id_medicion,
    id_servidor: row.id_servidor,
    id_operador: row.id_operador,
    operador: row.operadores?.nombre || "",
    cpu: row.cpu,
    temperatura: row.temperatura,
    energia: row.energia,
    estado: row.estado,
    fecha_medicion: row.fecha_medicion,
    observaciones: row.observaciones
  }));
}

async function loadMeasurements({ requestedAll, safeLimit }) {
  if (useSupabase) {
    let query = supabase
      .from("mediciones")
      .select(
        "id_medicion, id_servidor, id_operador, cpu, temperatura, energia, estado, fecha_medicion, observaciones, operadores!inner(nombre)"
      )
      .order("id_medicion", { ascending: false });

    if (!requestedAll) {
      query = query.limit(safeLimit);
    }

    const response = await query;

    if (response.error) {
      throw new Error(describeSupabaseError(response.error));
    }

    return mapSupabaseMeasurements(response.data);
  }

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

  const sql = requestedAll ? baseQuery : `${baseQuery} LIMIT ?`;
  const params = requestedAll ? [] : [safeLimit];
  const [rows] = await mysqlPool.query(sql, params);

  return rows;
}

async function saveMeasurement(payload) {
  const { idServidor, idOperador, estado, cpu, temperatura, energia } = payload;

  if (useSupabase) {
    const operatorResponse = await supabase
      .from("operadores")
      .select("id_operador")
      .eq("id_operador", idOperador)
      .limit(1);

    if (operatorResponse.error) {
      throw new Error(describeSupabaseError(operatorResponse.error));
    }

    if (!operatorResponse.data || operatorResponse.data.length === 0) {
      throw new Error("El usuario seleccionado no existe.");
    }

    const serverResponse = await supabase
      .from("servidores")
      .upsert(
        {
          id_servidor: idServidor,
          estado: "Activo"
        },
        {
          onConflict: "id_servidor"
        }
      );

    if (serverResponse.error) {
      throw new Error(describeSupabaseError(serverResponse.error));
    }

    const measurementResponse = await supabase
      .from("mediciones")
      .insert({
        id_servidor: idServidor,
        id_operador: idOperador,
        cpu,
        temperatura,
        energia,
        estado
      })
      .select("id_medicion")
      .single();

    if (measurementResponse.error) {
      throw new Error(describeSupabaseError(measurementResponse.error));
    }

    return measurementResponse.data;
  }

  const connection = await mysqlPool.getConnection();

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

    const [result] = await connection.query(
      `INSERT INTO mediciones (id_servidor, id_operador, cpu, temperatura, energia, estado)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [idServidor, idOperador, cpu, temperatura, energia, estado]
    );

    await connection.commit();
    return { id_medicion: result.insertId };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function verifySupabaseAccess() {
  const response = await supabase
    .from("operadores")
    .select("id_operador", { count: "exact", head: true });

  if (response.error) {
    throw new Error(describeSupabaseError(response.error));
  }
}

app.get("/api/operadores", async (req, res) => {
  try {
    const rows = await loadOperators();
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "No se pudieron cargar los usuarios." });
  }
});

app.get("/api/mediciones", async (req, res) => {
  const requestedAll = req.query.all === "1" || req.query.all === "true";
  const limit = Number(req.query.limit) || 50;
  const safeLimit = Math.min(Math.max(limit, 1), 200);

  try {
    const rows = await loadMeasurements({ requestedAll, safeLimit });
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "No se pudieron cargar las mediciones." });
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

  if (!["Activo", "Inactivo"].includes(estado)) {
    return res.status(400).json({ error: "El estado debe ser Activo o Inactivo." });
  }

  try {
    const saved = await saveMeasurement({
      idServidor,
      idOperador,
      estado,
      cpu,
      temperatura,
      energia
    });

    res.status(201).json({
      idMedicion: saved?.id_medicion,
      message: "Medición guardada correctamente."
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "No se pudo guardar la medición." });
  }
});

app.get("/api/health", async (req, res) => {
  try {
    if (useSupabase) {
      await verifySupabaseAccess();
      res.json({
        status: "ok",
        engine: "supabase",
        keyType: process.env.SUPABASE_SERVICE_ROLE_KEY ? "service_role" : "publishable"
      });
      return;
    }

    await mysqlPool.query("SELECT 1");
    res.json({ status: "ok", engine: "mysql" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", error: error.message });
  }
});

function describeStartupError(error) {
  if (useSupabase) {
    return error?.message || "Error desconocido al iniciar con Supabase.";
  }

  switch (error?.code) {
    case "ECONNREFUSED":
      return `No se pudo conectar a MySQL en ${dbHost}:${dbPort}. Verifica que el servicio esté iniciado.`;
    case "ER_ACCESS_DENIED_ERROR":
      return "MySQL rechazó el usuario o la contraseña configurados en .env.";
    case "ER_BAD_DB_ERROR":
      return `La base ${dbName} no existe y no se pudo crear automáticamente.`;
    default:
      return error?.message || "Error desconocido al iniciar el servidor.";
  }
}

async function start() {
  validateDatabaseConfig();

  if (useSupabase) {
    supabase = createSupabaseClient();
    await verifySupabaseAccess();
  } else {
    mysqlPool = createMysqlPool();
  }

  await ensureSeedData();

  app.listen(port, () => {
    console.log(
      `Servidor escuchando en http://localhost:${port} usando ${useSupabase ? "Supabase" : "MySQL"}`
    );
  });
}

start().catch((error) => {
  console.error("No se pudo iniciar el servidor:", describeStartupError(error));
  console.error(error);
  process.exit(1);
});
