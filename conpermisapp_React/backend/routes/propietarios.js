// const express = require('express');
// const { getConnection, sql } = require('../db');
// const router = express.Router();

// //GET /propietarios/
// router.get('/', async (req, res) => {
//     try {
//         const pool = await getConnection();
//         let query = 'SELECT * FROM Propietario';
//         const request = pool.request();
//         const result = await request.query(query);
//         res.status(200).json(result.recordset);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Error al obtener propietarios' });
//     }
// });


// //GET /propietarios/:rut
// // Verificar si un propietario existe por su RUT
// router.get('/:rut', async (req, res) => {
//     const { rut } = req.params;

//     try {
//         const pool = await getConnection();
//         const result = await pool.request()
//             .input('rut', sql.VarChar, rut)
//             .query(`
//                 SELECT * 
//                 FROM Propietario 
//                 WHERE rut = @rut
//             `);

//         if (result.recordset.length === 0) {
//             return res.status(404).json({ error: 'Propietario no encontrado' });
//         }

//         res.status(200).json(result.recordset[0]);
//     } catch (error) {
//         console.error('Error al obtener el propietario:', error);
//         res.status(500).json({ error: 'Error al obtener el propietario' });
//     }
// });


// // Crear un nuevo propietario
// router.post('/', async (req, res) => {
//     const { 
//         rut, 
//         nombres, 
//         apellidos, 
//         email, 
//         telefono 
//     } = req.body;

//     if (!rut || !nombres) {
//         return res.status(400).json({ error: 'El RUT y el nombre son obligatorios' });
//     }

//     try {
//         const pool = await getConnection();

//         // Insertar propietario
//         const result = await pool.request()
//             .input('rut', sql.VarChar, rut)
//             .input('nombres', sql.VarChar, nombres)
//             .input('apellidos', sql.VarChar, apellidos || null)
//             .input('email', sql.VarChar, email || null)
//             .input('telefono', sql.Int, telefono || null)
//             .query(`
//                 INSERT INTO Propietario (
//                     rut, nombres, apellidos, email, telefono
//                 ) VALUES (
//                     @rut, @nombres, @apellidos, @email, @telefono
//                 )
//             `);

//         res.status(201).json({ 
//             message: 'Propietario creado exitosamente',
//             propietario: result.recordset[0] });
//     } catch (error) {
//         console.error('Error al crear el propietario:', error);
//         res.status(500).json({ error: 'Error al crear el propietario' });
//     }
// });





// module.exports = router;

const express = require('express');
const { getConnection, sql } = require('../db');
const router = express.Router();

// Obtener propietarios con filtro opcional por RUT
router.get('/', async (req, res) => {
    const { rut } = req.query;

    try {
        const pool = await getConnection();
        let query = 'SELECT * FROM Propietario';

        if (rut) {
            query += ' WHERE rut = @rut';
        }

        const request = pool.request();
        if (rut) {
            request.input('rut', sql.VarChar, rut);
        }

        const result = await request.query(query);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'No se encontraron propietarios.' });
        }

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error al obtener propietarios:', error);
        res.status(500).json({ error: 'Error al obtener propietarios.' });
    }
});

// Crear un nuevo propietario
router.post('/', async (req, res) => {
    const { rut, nombres, apellidos, email, telefono } = req.body;

    if (!rut || !nombres) {
        return res.status(400).json({ error: 'El RUT y el nombre son obligatorios.' });
    }

    try {
        const pool = await getConnection();

        const result = await pool.request()
            .input('rut', sql.VarChar, rut)
            .input('nombres', sql.VarChar, nombres)
            .input('apellidos', sql.VarChar, apellidos || null)
            .input('email', sql.VarChar, email || null)
            .input('telefono', sql.Int, telefono || null)
            .query(`
                INSERT INTO Propietario (
                    rut, nombres, apellidos, email, telefono
                ) OUTPUT Inserted.*
                VALUES (
                    @rut, @nombres, @apellidos, @email, @telefono
                )
            `);

        res.status(201).json({
            message: 'Propietario creado exitosamente.',
            propietario: result.recordset[0]
        });
    } catch (error) {
        console.error('Error al crear el propietario:', error);
        res.status(500).json({ error: 'Error al crear el propietario.' });
    }
});

module.exports = router;
