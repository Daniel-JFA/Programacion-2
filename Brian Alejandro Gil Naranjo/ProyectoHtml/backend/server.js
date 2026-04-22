const express = require('express');
const mysql = require('mysql2/promise'); // Usaremos el driver de MySQL
const cors = require('cors');

// =================================================================
// 1. CONFIGURACIÓN INICIAL
// =================================================================
const app = express();
const port = 3000;

// Habilita CORS para permitir que tu HTML se comunique con esta API
app.use(cors());
app.use(express.json()); // Permite al servidor entender cuerpos de petición en formato JSON

// =================================================================
// 2. LÓGICA DE BASE DE DATOS (MySQL con XAMPP)
// =================================================================

// Configuración de la conexión a la base de datos de XAMPP
// Asegúrate de que la base de datos 'monitoreo_server' exista en tu phpMyAdmin.
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '', // La contraseña por defecto de XAMPP es vacía
    database: 'monitoreo_server'
};

let pool;

async function initializeDatabase() {
    try {
        // Creamos un "pool" de conexiones para manejar las peticiones de forma eficiente
        pool = mysql.createPool(dbConfig);
        console.log("Pool de conexiones a MySQL/MariaDB creado.");

        // Crear la tabla si no existe (sintaxis para MySQL)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS servers (
                id INT PRIMARY KEY AUTO_INCREMENT,
                server_id VARCHAR(255) NOT NULL,
                cpu DOUBLE NOT NULL,
                temperature DOUBLE NOT NULL,
                energy DOUBLE NOT NULL
            )
        `);

        // Verificar si la tabla ya tiene datos
        const [rows] = await pool.query("SELECT COUNT(*) as count FROM servers");
        if (rows[0].count === 0) {
            console.log("Poblando la base de datos con datos de ejemplo...");
            const query = "INSERT INTO servers (server_id, cpu, temperature, energy) VALUES (?, ?, ?, ?)";
            for (let i = 1; i <= 50; i++) {
                const serverId = `SRV-DC${Math.floor(Math.random() * 3) + 1}-${String(i).padStart(2, '0')}`;
                const cpu = (Math.random() * 90 + 10).toFixed(2);
                const temp = (Math.random() * 70 + 40).toFixed(2);
                const energy = (Math.random() * 450 + 150).toFixed(2);
                await pool.query(query, [serverId, cpu, temp, energy]);
            }
            console.log("Base de datos poblada con 50 servidores.");
        }

    } catch (err) {
        console.error("Error al inicializar la base de datos MySQL:", err.message);
        console.error("Asegúrate de que XAMPP esté corriendo y la base de datos 'monitoreo_server' exista.");
        process.exit(1); // Si la BD falla, detenemos la aplicación.
    }
}

// =================================================================
// 3. DEFINICIÓN DE LA API (ENDPOINT)
// =================================================================

app.get('/api/servers', async (req, res) => {
    try {
        // Usamos el pool para hacer la consulta. La respuesta es un array [rows, fields].
        const [rows] = await pool.query("SELECT server_id, cpu, temperature, energy FROM servers");
        res.json(rows); // Enviamos solo las filas
    } catch (err) {
        res.status(500).json({ "error": err.message });
    }
});

app.post('/api/servers', async (req, res) => {
    try {
        console.log("Recibida una petición POST a /api/servers con el cuerpo:", req.body);

        const { server_id, cpu, temperature, energy } = req.body;

        // Validación básica en el backend
        if (!server_id || cpu == null || temperature == null || energy == null) {
            return res.status(400).json({ error: "Faltan datos. Se requiere server_id, cpu, temperature y energy." });
        }

        const query = "INSERT INTO servers (server_id, cpu, temperature, energy) VALUES (?, ?, ?, ?)";
        await pool.query(query, [server_id, cpu, temperature, energy]);

        res.status(201).json({ message: "Servidor agregado exitosamente." });

    } catch (err) {
        console.error("Error al insertar servidor:", err.message);
        res.status(500).json({ error: "Error interno del servidor al agregar el servidor." });
    }
});

initializeDatabase().then(() => {
    app.listen(port, () => {
        console.log(`Servidor corriendo en http://localhost:${port}, conectado a MySQL.`);
    });
});