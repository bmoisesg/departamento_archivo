var express = require("express");
const sql = require('mssql/msnodesqlv8');
const archivo = express.Router();

const config = {
    connectionString: `Driver={ODBC Driver 17 for SQL Server};Server=${process.env.DB_SERVER};Database=${process.env.DB_DATABASE};Trusted_Connection=Yes;`,
    options: {
        trustServerCertificate: true
    },
    driver: 'msnodesqlv8'
};

archivo.post('/', async(req, res) => {
    try {
        let titulo = req.body.titulo;
        let id_tipo = req.body.id_tipo;
        let fiscal = req.body.fiscal_ingresa;

        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('titulo', sql.NVarChar, titulo)
            .input('id_tipo', sql.Int, id_tipo)
            .input('fiscal', sql.NVarChar, fiscal)
            .query('EXEC sp_InsertArchivo @titulo, @id_tipo, @fiscal');

        res.json(result.recordset);
    } catch (err) {
        console.error('Error en la consulta:', err);
        res.status(500).json({ error: 'Error al conectar a la base de datos' });
    }
});


archivo.get('/', async(req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('EXEC sp_GetArchivos;');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error en la consulta:', err);
        res.status(500).json({ error: 'Error al conectar a la base de datos' });
    }
});


module.exports = archivo;