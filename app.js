var express = require('express');
var morgan = require('morgan');
const sql = require('mssql/msnodesqlv8');
var app = express();
require('dotenv').config();

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.listen(8080, function() {
    console.log('app listening on port 8080!');
});

const config = {
    connectionString: `Driver={ODBC Driver 17 for SQL Server};Server=${process.env.DB_SERVER};Database=${process.env.DB_DATABASE};Trusted_Connection=Yes;`,
    options: {
        trustServerCertificate: true
    },
    driver: 'msnodesqlv8'
};

// Endpoints ----------------------------------------

app.get('/', function(req, res) {
    res.json({ mensaje: "hola mundo melmv" });
});

app.get('/tipo', async(req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('EXEC sp_GetTipo;');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error en la consulta:', err);
        res.status(500).json({ error: 'Error al conectar a la base de datos' });
    }
});

app.post('/archivo', async(req, res) => {
    try {
        let titulo = req.body.titulo;
        let id_tipo = req.body.id_tipo;
        let fiscal = req.body.fiscal_ingresa;

        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('titulo', sql.NVarChar, titulo)
            .input('id_tipo', sql.Int, id_tipo)
            .input('fiscal', sql.Int, fiscal)
            .query('EXEC sp_InsertArchivo @titulo, @id_tipo, @fiscal');

        res.json(result.recordset);
    } catch (err) {
        console.error('Error en la consulta:', err);
        res.status(500).json({ error: 'Error al conectar a la base de datos' });
    }
});

app.post('/historial', async(req, res) => {
    try {
        let id_archivo = req.body.id_archivo;
        let id_estado = req.body.id_estado;
        let fecha = req.body.fecha;
        let motivo = req.body.motivo;

        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('id_archivo', sql.Int, id_archivo)
            .input('id_estado', sql.Int, id_estado)
            .input('fecha', sql.NVarChar, fecha)
            .input('motivo', sql.NVarChar, motivo)
            .query('EXEC sp_InsertHistorial @id_archivo, @id_estado, @fecha, @motivo');

        res.json(result.recordset);
    } catch (err) {
        console.error('Error en la consulta:', err);
        res.status(500).json({ error: 'Error al conectar a la base de datos' });
    }
});
app.get('/historial/:id', async(req, res) => {
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


app.get('/archivo', async(req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('EXEC sp_GetArchivos;');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error en la consulta:', err);
        res.status(500).json({ error: 'Error al conectar a la base de datos' });
    }
});

app.get('/estados_archivo', async(req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('EXEC sp_GetEstados;');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error en la consulta:', err);
        res.status(500).json({ error: 'Error al conectar a la base de datos' });
    }
});


app.get('/estado_archivo/:id', async(req, res) => {
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