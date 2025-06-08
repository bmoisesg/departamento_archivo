var express = require("express");
const sql = require('mssql/msnodesqlv8');
const estadoArchivo = express.Router();

const config = {
    connectionString: `Driver={ODBC Driver 17 for SQL Server};Server=${process.env.DB_SERVER};Database=${process.env.DB_DATABASE};Trusted_Connection=Yes;`,
    options: {
        trustServerCertificate: true
    },
    driver: 'msnodesqlv8'
};

estadoArchivo.get('/estado_archivo', async(req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('EXEC sp_GetEstados;');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error en la consulta:', err);
        res.status(500).json({ error: 'Error al conectar a la base de datos' });
    }
});


estadoArchivo.get('/:id', async(req, res) => {
    try {
        let id = req.params.id;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('id_archivo', sql.Int, id)
            .query('EXEC sp_estadoActualArchivo @id_archivo');

        res.json(result.recordset);
    } catch (err) {
        console.error('Error en la consulta:', err);
        res.status(500).json({ error: 'Error al conectar a la base de datos' });
    }
});

module.exports = estadoArchivo;