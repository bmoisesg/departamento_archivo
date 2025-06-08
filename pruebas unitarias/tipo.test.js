const request = require('supertest');
const express = require('express');
const tipoRouter = require('../models/tipo');
const sql = require('mssql/msnodesqlv8');

jest.mock('mssql/msnodesqlv8');

describe('GET /tipo', () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use('/tipo', tipoRouter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    it('debería responder con status 200', async() => {
        const mockRecordset = [
            { id_tipo: 1, titulo: "estado1" },
            { id_tipo: 2, titulo: "estadol" }
        ];

        const fakeReq = {
            query: jest.fn().mockResolvedValue({ recordset: mockRecordset })
        };

        const fakePool = {
            request: jest.fn().mockReturnValue(fakeReq)
        };

        sql.connect.mockResolvedValue(fakePool);

        const response = await request(app).get('/tipo');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockRecordset);
    });

});

describe('GET /archivo', () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use('/archivo', tipoRouter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    it('debería responder con status 200', async() => {
        const mockRecordset = [{
                "id_archivo": 1,
                "tituloo": "titulo",
                "tipoArchivo": "tipoArchivo",
                "fiscal_ingreso": "fiscal_ingreso",
            },
            {
                "id_archivo": 1,
                "titulo": "titulo",
                "tipoArchivo": "tipoArchivo",
                "fiscal_ingreso": "fiscal_ingreso",
            }
        ];

        const fakeReq = {
            query: jest.fn().mockResolvedValue({ recordset: mockRecordset })
        };

        const fakePool = {
            request: jest.fn().mockReturnValue(fakeReq)
        };

        sql.connect.mockResolvedValue(fakePool);

        const response = await request(app).get('/archivo');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockRecordset);
    });
});

describe('GET /reporte/1', () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use('/reporte/1', tipoRouter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    it('debería responder con status 200', async() => {
        const mockRecordset = [{
            "id_archivo": 1,
            "titulo": "documento",
            "contador": 1
        }, ];

        const fakeReq = {
            query: jest.fn().mockResolvedValue({ recordset: mockRecordset })
        };

        const fakePool = {
            request: jest.fn().mockReturnValue(fakeReq)
        };

        sql.connect.mockResolvedValue(fakePool);

        const response = await request(app).get('/reporte/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockRecordset);
    });
});

describe('GET /reporte/2', () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use('/reporte/2', tipoRouter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    it('debería responder con status 200', async() => {
        const mockRecordset = [{
            "titulo": "titulo",
            "cantidad": 3
        }, ];

        const fakeReq = {
            query: jest.fn().mockResolvedValue({ recordset: mockRecordset })
        };

        const fakePool = {
            request: jest.fn().mockReturnValue(fakeReq)
        };

        sql.connect.mockResolvedValue(fakePool);

        const response = await request(app).get('/reporte/2');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockRecordset);
    });
});