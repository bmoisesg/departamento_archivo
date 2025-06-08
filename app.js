var express = require('express');
var morgan = require('morgan');
const cors = require('cors');
const sql = require('mssql/msnodesqlv8');
var app = express();
require('dotenv').config();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.listen(process.env.PORT, function() {
    console.log(`app listening on port ${process.env.PORT}!`);
});

const config = {
    connectionString: `Driver={ODBC Driver 17 for SQL Server};Server=${process.env.DB_SERVER};Database=${process.env.DB_DATABASE};Trusted_Connection=Yes;`,
    options: {
        trustServerCertificate: true
    },
    driver: 'msnodesqlv8'
};

const historial = require("./models/historial");
const archivo = require("./models/archivo");
const tipo = require("./models/tipo");
const reporte = require("./models/reporte");
const estadoArchivo = require("./models/estado_archivo");

// Endpoints ----------------------------------------

app.get('/', function(req, res) {
    res.json({ mensaje: "hola mundo melmv" });
});

app.use('/historial', historial);
app.use('/archivo', archivo);
app.use('/tipo', tipo);
app.use('/reporte', reporte);
app.use('/estado_archivo', estadoArchivo);