var express = require("express");
const sql = require('mssql/msnodesqlv8');
const tipo = express.Router();

const config = {
    connectionString: `Driver={ODBC Driver 17 for SQL Server};Server=${process.env.DB_SERVER};Database=${process.env.DB_DATABASE};Trusted_Connection=Yes;`,
    options: {
        trustServerCertificate: true
    },
    driver: 'msnodesqlv8'
};

tipo.get('/', async(req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('EXEC sp_GetTipo;');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error en la consulta:', err);
        res.status(500).json({ error: 'Error al conectar a la base de datos' });
    }
});

module.exports = tipo;