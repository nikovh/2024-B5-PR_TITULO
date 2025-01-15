const express = require('express');
const { getConnection, sql } = require('../db');

const router = express.Router();

//--------- RUTAS ---------//

/* GET /expedientes
  - Si NO se pasa ningún parámetro retorna TODOS los expedientes
  - Si se pasa "?usuario_rut=xxxx" filtra por la columna [Usuario_rut]
*/
router.get('/', async (req, res) => {
    const usuarioRut = req.query.usuario_rut;
    try {
        const pool = await getConnection();

        //si se envia el usuario_rut se filtra, sino se traen todos los expedientes
        let query = 'SELECT * FROM Expedientes';
        if (usuarioRut) {
            query += ' WHERE Usuario_rut = @usuarioRut';
        }

        const request = pool.request();
        if (usuarioRut) {
            request.input('usuarioRut', sql.VarChar, usuarioRut);
        }
        
        const result = await request.query(query);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener expedientes' });
    }
});


// GET /expedientes con JOIN - Obtener expedientes con información del propietario
router.get('/expedientes', async (req, res) => {
    const usuarioRut = req.query.usuario_rut;
    try {
        const pool = await getConnection();
        let query = `
            SELECT
                e.*,
                p.rut AS Propietario_rut
            FROM Expedientes e
            LEFT JOIN Propietario p ON e.Propietario_rut = p.rut`;

        if (usuarioRut) {
            query += ' WHERE e.usuario_rut = @usuarioRut';
        }

        const request = pool.request();
        if (usuarioRut) {
            request.input('usuarioRut', sql.VarChar, usuarioRut);
        }

        const result = await request.query(query);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error al obtener expedientes:', error);
        res.status(500).json({ error: 'Error al obtener expedientes.' });
    }
});


// GET TIPOS de expedientes
router.get('/tipo-expediente', async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT id, nombre FROM TipoExpediente');
        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener tipos de expediente' });
    }
});


// GET SUBTIPOS de expedientes
router.get('/subtipo-expediente', async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT id, nombre FROM SubTipoExpediente');
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener los subtipos de expedientes'});
    }
});


// // POST crear un nuevo expediente
// router.post('/', async (req, res) => {
//     const { 
//         descripcion, 
//         tipo, 
//         subtipo, 
//         Propietario_rut, 
//         Usuario_rut,
//         EstadoExpediente_id
//     } = req.body;

//     try {
//         const pool = await getConnection();
//         //.input() para mapear cada valor a la consulta
//         const result = await pool.request()
//             .input('descripcion',           sql.VarChar, descripcion)
//             .input('tipo',                  sql.VarChar, tipo)
//             .input('subtipo',               sql.VarChar, subtipo)
//             .input('Propietario_rut',       sql.VarChar, Propietario_rut)
//             .input('Usuario_rut',           sql.VarChar, Usuario_rut)
//             .input('EstadoExpediente_id',   sql.Int,     EstadoExpediente_id)
//             .query(`
//                 INSERT INTO Expedientes (
//                     descripcion, 
//                     tipo, 
//                     subtipo, 
//                     Propietario_rut, 
//                     Usuario_rut,
//                     EstadoExpediente_id
//                 )
//                 VALUES (
//                     @descripcion,
//                     @tipo,
//                     @subtipo,
//                     @Propietario_rut,
//                     @Usuario_rut,
//                     @EstadoExpediente_id
//                 );
//                 SELECT SCOPE_IDENTITY() AS newExpedienteId;
//             `);
//         const newId = 
//             result.recordset && result.recordset[0]
//             ? result.recordset[0].newExpedienteId 
//             : null;

//         res.status(201).json({ message: 'Expediente creado', id: newId, });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Error al crear expediente' });
//     }
// });


// POST crear un nuevo expediente 
router.post('/expedientes', async (req, res) => {
    const {
        descripcion,
        tipo,
        subtipo,
        propietario,
        usuarioRut,
        estadoExpedienteId
    } = req.body;

    if ( !propietario || !usuarioRut) {
        return res.status(400).json({ error: "Completa los campos obligatorios."});
    }

    try {
        const pool = await getConnection();

        //verfiicar si el propietario existe
        const propietarioExistente = await pool.request()
            .input("rut", sql.VarChar, proietario.rut)
            .query("SELECT * FROM Propietario WHERE rut = @rut");
        
        if (propietarioExistente.recordset.length === 0) {
            //si no existe, crear propietario
            await pool.request()
                .input("rut",               sql.VarChar, propietario.rut)
                .input("nombre",            sql.VarChar, propietario.nombre)
                .input("apellidoPaterno",   sql.VarChar, propietario.apellidoPaterno || null)
                .input("apellidoMaterno",   sql.VarChar, propietario.apellidoMaterno || null)
                .input("email",             sql.VarChar, propietario.email || null)
                .input("telefono",          sql.Int, propietario.telefono || null)
                .query(`
                    INSERT INTO Propietario (
                        rut, 
                        nombre, 
                        apellidoPaterno, 
                        apellidoMaterno, 
                        email, 
                        telefono)
                    VALUES (
                        @rut, 
                        @nombre, 
                        @apellidoPaterno, 
                        @apellidoMaterno, 
                        @email, 
                        @telefono)
                `);
        }

        //Crear el expediente
        await pool.request()
            .input("descripcion", sql.VarChar, descripcion)
            .input("tipo", sql.VarChar, tipo)
            .input("subtipo", sql.VarChar, subtipo)
            .input("propietarioRut", sql.VarChar, propietario.rut)
            .input("usuarioRut", sql.VarChar, usuarioRut)
            .input("estadoExpedienteId", sql.Int, estadoExpedienteId)
            .query(`
                INSERT INTO Expedientes (
                    descripcion, 
                    tipo, 
                    subtipo, 
                    Propietario_rut, 
                    Usuario_rut, 
                    EstadoExpediente_id)
                VALUES (
                    @descripcion, 
                    @tipo, 
                    @subtipo, 
                    @propietarioRut, 
                    @usuarioRut, 
                    @estadoExpedienteId)
            `);

        res.status(201).json({ message: "Expediente creado exitosamente." });
    } catch (err) {
        console.error("Error al crear el expediente:", err);
        res.status(500).json({ error: "Error al crear el expediente."});
    }
});

// Exportar directamente el router
module.exports = router;