const express = require('express');
const { getConnection, sql } = require('../db');
const router = express.Router();

// GET /propiedades/
// Obtener todas las propiedades
router.get('/', async (req, res) => {
    try {
        const pool = await getConnection();
        const query = 'SELECT * FROM Propiedad';
        const request = pool.request();
        const result = await request.query(query);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error al obtener propiedades:', error);
        res.status(500).json({ error: 'Error al obtener propiedades' });
    }
});

// GET /propiedades/:id
// Obtener una propiedad por su ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT * 
                FROM Propiedad 
                WHERE id = @id
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Propiedad no encontrada' });
        }

        res.status(200).json(result.recordset[0]);
    } catch (error) {
        console.error('Error al obtener la propiedad:', error);
        res.status(500).json({ error: 'Error al obtener la propiedad' });
    }
});

// POST /propiedades/
// Crear una nueva propiedad
router.post('/', async (req, res) => {
    const {
        rolSII,
        direccion,
        numero,
        comuna,
        region,
        inscFojas,
        inscNumero,
        inscYear,
        numPisos,
        m2,
        destino,
    } = req.body;

    // Validación de campos obligatorios
    if (!rolSII || !direccion || !comuna || !region) {
        return res.status(400).json({ error: 'Campos obligatorios faltantes.' });
    }

    try {
        const pool = await getConnection();

        // Insertar propiedad
        await pool.request()
            .input('rolSII', sql.VarChar, rolSII)
            .input('direccion', sql.VarChar, direccion)
            .input('numero', sql.Int, numero || null)
            .input('comuna', sql.VarChar, comuna)
            .input('region', sql.VarChar, region)
            .input('inscFojas', sql.VarChar, inscFojas || null)
            .input('inscNumero', sql.Int, inscNumero || null)
            .input('inscYear', sql.Int, inscYear || null)
            .input('numPisos', sql.Int, numPisos || null)
            .input('m2', sql.Decimal(10, 2), m2 || null)
            .input('destino', sql.VarChar, destino || null)
            .query(`
                INSERT INTO Propiedad (
                    rolSII, direccion, numero, comuna, region,
                    inscFojas, inscNumero, inscYear, numPisos, m2, destino
                ) VALUES (
                    @rolSII, @direccion, @numero, @comuna, @region,
                    @inscFojas, @inscNumero, @inscYear, @numPisos, @m2, @destino
                )
            `);

        res.status(201).json({ message: 'Propiedad creada exitosamente' });
    } catch (error) {
        console.error('Error al crear la propiedad:', error);
        res.status(500).json({ error: 'Error al crear la propiedad.' });
    }
});

module.exports = router;
