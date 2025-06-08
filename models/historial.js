var express = require("express");
const sql = require('mssql/msnodesqlv8');
const historial = express.Router();

const config = {
    connectionString: `Driver={ODBC Driver 17 for SQL Server};Server=${process.env.DB_SERVER};Database=${process.env.DB_DATABASE};Trusted_Connection=Yes;`,
    options: {
        trustServerCertificate: true
    },
    driver: 'msnodesqlv8'
};

// Inseta un registro en el historial, el archivo hizo un movimiento
historial.post('/', async(req, res) => {
    try {
        let id_archivo = req.body.id_archivo;
        let id_estado = req.body.id_estado;
        let fecha = req.body.fecha;
        let motivo = req.body.motivo;

        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('id_archivo', sql.Int, id_archivo)
            .input('id_estado', sql.Int, id_estado)

        .input('motivo', sql.NVarChar, motivo)
            .query('EXEC sp_InsertHistorial @id_archivo, @id_estado, @motivo');

        res.json(result.recordset);
    } catch (err) {
        console.error('Error en la consulta:', err);
        res.status(500).json({ error: 'Error al conectar a la base de datos' });
    }
});

// Lista el historial de un archivo en base a un id
historial.get('/:id', async(req, res) => {
    try {
        let id = req.params.id;
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('id_archivo', sql.Int, id)
            .query('EXEC sp_historialArchivo @id_archivo');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error en la consulta:', err);
        res.status(500).json({ error: 'Error al conectar a la base de datos' });
    }
});


module.exports = historial;