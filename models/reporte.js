var express = require("express");
const sql = require('mssql/msnodesqlv8');
const reporte = express.Router();

const config = {
    connectionString: `Driver={ODBC Driver 17 for SQL Server};Server=${process.env.DB_SERVER};Database=${process.env.DB_DATABASE};Trusted_Connection=Yes;`,
    options: {
        trustServerCertificate: true
    },
    driver: 'msnodesqlv8'
};

// Listar reporte para mostrar el numero de moviemntos que ha tenido todos los archivos
reporte.get('/1', async(req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('EXEC sp_reporte1;');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error en la consulta:', err);
        res.status(500).json({ error: 'Error al conectar a la base de datos' });
    }
});

// Listar reporte para msotrar cuantos archivos tiene cada estado de archivo
reporte.get('/2', async(req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('EXEC sp_reporte2;');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error en la consulta:', err);
        res.status(500).json({ error: 'Error al conectar a la base de datos' });
    }
});

module.exports = reporte;