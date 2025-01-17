const express = require('express');
const { getConnection, sql } = require('../db');
const router = express.Router();

//GET /propietarios/
router.get('/', async (req, res) => {

    try {
        const pool = await getConnection();
        let query = 'SELECT * FROM Propietario';
        const request = pool.request();
        const result = await request.query(query);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener propietarios' });
    }
});


//GET /propietarios/:rut
// Verificar si un propietario existe por su RUT
router.get('/:rut', async (req, res) => {
    const { rut } = req.params;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('rut', sql.VarChar, rut)
            .query(`
                SELECT * 
                FROM Propietario 
                WHERE rut = @rut
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Propietario no encontrado' });
        }

        res.status(200).json(result.recordset[0]);
    } catch (error) {
        console.error('Error al obtener el propietario:', error);
        res.status(500).json({ error: 'Error al obtener el propietario' });
    }
});


// Crear un nuevo propietario
router.post('/', async (req, res) => {
    const { rut, nombres, apellidos, email, telefono } = req.body;

    if (!rut || !nombres) {
        return res.status(400).json({ error: 'El RUT y el nombre son obligatorios' });
    }

    try {
        const pool = await getConnection();

        // Insertar propietario
        await pool.request()
            .input('rut', sql.VarChar, rut)
            .input('nombres', sql.VarChar, nombres)
            .input('apellidos', sql.VarChar, apellidos || null)
            .input('email', sql.VarChar, email || null)
            .input('telefono', sql.Int, telefono || null)
            .query(`
                INSERT INTO Propietario (
                    rut, nombres, apellidos, email, telefono
                ) VALUES (
                    @rut, @nombres, @apellidos, @email, @telefono
                )
            `);

        res.status(201).json({ message: 'Propietario creado exitosamente' });
    } catch (error) {
        console.error('Error al crear el propietario:', error);
        res.status(500).json({ error: 'Error al crear el propietario' });
    }
});


router.post('/', async (req, res) => {
    const { descripcion, tipo, subtipo, propietario, usuarioRut, estadoExpedienteId } = req.body;

    if (!propietario || !usuarioRut) {
        return res.status(400).json({ error: 'Completa los campos obligatorios.' });
    }

    try {
        const pool = await getConnection();

        // Verificar si el propietario existe
        const propietarioExistente = await pool.request()
            .input('rut', sql.VarChar, propietario.rut)
            .query('SELECT * FROM Propietario WHERE rut = @rut');

        if (propietarioExistente.recordset.length === 0) {
            // Crear propietario si no existe
            await pool.request()
                .input('rut', sql.VarChar, propietario.rut)
                .input('nombres', sql.VarChar, propietario.nombres)
                .input('apellidos', sql.VarChar, propietario.apellidos || null)
                .input('email', sql.VarChar, propietario.email || null)
                .input('telefono', sql.Int, propietario.telefono || null)
                .query(`
                    INSERT INTO Propietario (
                        rut, nombres, apellidos, email, telefono
                    ) VALUES (
                        @rut, @nombres, @apellidos, @email, @telefono
                    )
                `);
        }

        // Crear el expediente
        await pool.request()
            .input('descripcion', sql.VarChar, descripcion)
            .input('tipo', sql.VarChar, tipo)
            .input('subtipo', sql.VarChar, subtipo)
            .input('propietarioRut', sql.VarChar, propietario.rut)
            .input('usuarioRut', sql.VarChar, usuarioRut)
            .input('estadoExpedienteId', sql.Int, estadoExpedienteId)
            .query(`
                INSERT INTO Expedientes (
                    descripcion, tipo, subtipo, Propietario_rut, Usuario_rut, EstadoExpediente_id
                ) VALUES (
                    @descripcion, @tipo, @subtipo, @propietarioRut, @usuarioRut, @estadoExpedienteId
                )
            `);

        res.status(201).json({ message: 'Expediente creado exitosamente' });
    } catch (err) {
        console.error('Error al crear el expediente:', err);
        res.status(500).json({ error: 'Error al crear el expediente.' });
    }
});



module.exports = router;