const express = require('express');
const { getConnection, sql } = require('../db');

const router = express.Router();

// Consolidado: Obtener expedientes con filtro opcional por usuario_email o usuario_rut
router.get('/', async (req, res) => {
    const usuarioEmail = req.query.usuario_email;
    const usuarioRut = req.query.usuario_rut;

    try {
        const pool = await getConnection();
        let query = `
            SELECT
                e.*,
                p.rut AS Propietario_rut,
                p.nombres AS Propietario_nombres
            FROM Expedientes e
            LEFT JOIN Propietario p ON e.Propietario_rut = p.rut`;

        if (usuarioEmail) {
            query += ' WHERE e.Usuario_email = @usuarioEmail';
        } else if (usuarioRut) {
            query += ' WHERE e.Usuario_rut = @usuarioRut';
        }

        const request = pool.request();
        if (usuarioEmail) {
            request.input('usuarioEmail', sql.VarChar, usuarioEmail);
        } else if (usuarioRut) {
            request.input('usuarioRut', sql.VarChar, usuarioRut);
        }

        const result = await request.query(query);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error al obtener expedientes:', error);
        res.status(500).json({ error: 'Error al obtener expedientes.' });
    }
});

// Obtener tipos de expedientes
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

// Obtener subtipos de expedientes
router.get('/subtipo-expediente', async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT id, nombre FROM SubTipoExpediente');
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener los subtipos de expedientes' });
    }
});

// Obtener detalle de un expediente por ID
// router.get('/:id/detalle', async (req, res) => {
//     const { id } = req.params;

//     try {
//         const pool = await getConnection();
//         const result = await pool.request()
//             .input('id', sql.Int, id)
//             .query(`
//                 SELECT 
//                     e.id AS expedienteId,
//                     e.descripcion,
//                     e.tipo,
//                     e.subtipo,
//                     e.EstadoExpediente_id,
//                     ee.tipoEstado AS estadoNombre, 
//                     e.fechaCreacion,
//                     e.Usuario_email,
//                     p.rut AS propietarioRut,
//                     p.nombres AS propietarioNombres,
//                     p.apellidos AS propietarioApellidos
//                 FROM Expedientes e
//                 LEFT JOIN Propietario p ON e.Propietario_rut = p.rut
//                 LEFT JOIN EstadoExpediente ee ON e.EstadoExpediente_id = ee.id
//                 WHERE e.id = @id
//             `);

//         if (result.recordset.length === 0) {
//             return res.status(404).json({ error: 'Expediente no encontrado' });
//         }

//         res.status(200).json(result.recordset[0]);
//     } catch (error) {
//         console.error('Error al obtener el detalle del expediente:', error);
//         res.status(500).json({ error: 'Error al obtener el detalle del expediente.' });
//     }
// });

// Obtener detalle de un expediente por ID
router.get('/:id/detalle', async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT 
                    e.id AS expedienteId,
                    e.descripcion,
                    e.tipo,
                    e.subtipo,
                    e.EstadoExpediente_id,
                    ee.tipoEstado AS estadoNombre, 
                    e.fechaCreacion,
                    e.Usuario_email,
                    p.rut AS propietarioRut,
                    p.nombres AS propietarioNombres,
                    p.apellidos AS propietarioApellidos,
                    p.email AS propietarioEmail,
                    p.telefono AS propietarioTelefono,
                    pr.rolSII AS propiedadRolSII,
                    pr.direccion AS propiedadDireccion,
                    pr.numero AS propiedadNumero,
                    pr.comuna AS propiedadComuna,
                    pr.region AS propiedadRegion,
                    pr.inscFojas AS propiedadInscFojas,
                    pr.inscNumero AS propiedadInscNumero,
                    pr.inscYear AS propiedadInscYear,
                    pr.numPisos AS propiedadNumPisos,
                    pr.m2 AS propiedadM2,
                    pr.destino AS propiedadDestino
                FROM Expedientes e
                LEFT JOIN Propietario p ON e.Propietario_rut = p.rut
                LEFT JOIN EstadoExpediente ee ON e.EstadoExpediente_id = ee.id
                LEFT JOIN Propiedad pr ON e.id = pr.expediente_id
                WHERE e.id = @id
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Expediente no encontrado' });
        }

        // Estructurar la respuesta con datos separados
        const expediente = {
            id: result.recordset[0].expedienteId,
            descripcion: result.recordset[0].descripcion,
            tipo: result.recordset[0].tipo,
            subtipo: result.recordset[0].subtipo,
            estado: {
                id: result.recordset[0].EstadoExpediente_id,
                nombre: result.recordset[0].estadoNombre,
            },
            fechaCreacion: result.recordset[0].fechaCreacion,
            usuarioEmail: result.recordset[0].Usuario_email,
        };

        const propietario = {
            rut: result.recordset[0].propietarioRut,
            nombres: result.recordset[0].propietarioNombres,
            apellidos: result.recordset[0].propietarioApellidos,
            email: result.recordset[0].propietarioEmail,
            telefono: result.recordset[0].propietarioTelefono,
        };

        const propiedad = {
            rolSII: result.recordset[0].propiedadRolSII,
            direccion: result.recordset[0].propiedadDireccion,
            numero: result.recordset[0].propiedadNumero,
            comuna: result.recordset[0].propiedadComuna,
            region: result.recordset[0].propiedadRegion,
            inscFojas: result.recordset[0].propiedadInscFojas,
            inscNumero: result.recordset[0].propiedadInscNumero,
            inscYear: result.recordset[0].propiedadInscYear,
            numPisos: result.recordset[0].propiedadNumPisos,
            m2: result.recordset[0].propiedadM2,
            destino: result.recordset[0].propiedadDestino,
        };

        res.status(200).json({ expediente, propietario, propiedad });
    } catch (error) {
        console.error('Error al obtener el detalle del expediente:', error);
        res.status(500).json({ error: 'Error al obtener el detalle del expediente.' });
    }
});


// Crear un nuevo expediente con propietario y propiedad asociada
router.post('/', async (req, res) => {
    const { descripcion, tipo, subtipo, propietario, propiedad, usuarioEmail } = req.body;

    if (!descripcion || !tipo || !subtipo || !propietario || !usuarioEmail || !propiedad) {
        return res.status(400).json({ error: 'Faltan campos obligatorios.' });
    }

    try {
        const pool = await getConnection();
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            // Verificar o crear propietario
            const propietarioExistente = await transaction.request()
                .input('rut', sql.VarChar, propietario.rut)
                .query('SELECT * FROM Propietario WHERE rut = @rut');

            if (propietarioExistente.recordset.length === 0) {
                await transaction.request()
                    .input('rut', sql.VarChar, propietario.rut)
                    .input('nombres', sql.VarChar, propietario.nombres)
                    .input('apellidos', sql.VarChar, propietario.apellidos)
                    .input('email', sql.VarChar, propietario.email)
                    .input('telefono', sql.VarChar, propietario.telefono)
                    .query(`
                        INSERT INTO Propietario (rut, nombres, apellidos, email, telefono)
                        VALUES (@rut, @nombres, @apellidos, @email, @telefono)
                    `);
            }

            // Crear expediente
            const expedienteResult = await transaction.request()
                .input('descripcion', sql.VarChar, descripcion)
                .input('tipo', sql.VarChar, tipo)
                .input('subtipo', sql.VarChar, subtipo)
                .input('propietarioRut', sql.VarChar, propietario.rut)
                .input('usuarioEmail', sql.VarChar, usuarioEmail)
                .query(`
                    INSERT INTO Expedientes (descripcion, tipo, subtipo, propietario_rut, usuario_email)
                    OUTPUT INSERTED.id
                    VALUES (@descripcion, @tipo, @subtipo, @propietarioRut, @usuarioEmail)
                `);

            const expedienteId = expedienteResult.recordset[0].id;

            // Crear propiedad asociada
            if (propiedad) {
                await transaction.request()
                    .input('rolSII', sql.VarChar, propiedad.rolSII)
                    .input('direccion', sql.VarChar, propiedad.direccion)
                    .input('numero', sql.Int, propiedad.numero)
                    .input('comuna', sql.VarChar, propiedad.comuna)
                    .input('region', sql.VarChar, propiedad.region)
                    .input('inscFojas', sql.VarChar, propiedad.inscFojas)
                    .input('inscNumero', sql.VarChar, propiedad.inscNumero)
                    .input('inscYear', sql.Int, propiedad.inscYear)
                    .input('numPisos', sql.Int, propiedad.numPisos)
                    .input('m2', sql.Float, propiedad.m2)
                    .input('destino', sql.VarChar, propiedad.destino)
                    .input('expedienteId', sql.Int, expedienteId)
                    .query(`
                        INSERT INTO Propiedad (
                            rolSII, direccion, numero, comuna, region, 
                            inscFojas, inscNumero, inscYear, numPisos, m2, destino, expediente_id
                        )
                        VALUES (
                            @rolSII, @direccion, @numero, @comuna, @region, 
                            @inscFojas, @inscNumero, @inscYear, @numPisos, @m2, @destino, @expedienteId
                        )
                    `);
            }

            await transaction.commit();
            res.status(201).json({ id: expedienteId, message: 'Expediente creado exitosamente' });
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    } catch (err) {
        console.error('Error al crear expediente:', err);
        res.status(500).json({ error: 'Error al crear expediente.' });
    }
});

// Actualizar un expediente por ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { descripcion, tipo, subtipo, estadoExpedienteId } = req.body;

    try {
        const pool = await getConnection();

        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('descripcion', sql.VarChar, descripcion)
            .input('tipo', sql.VarChar, tipo)
            .input('subtipo', sql.VarChar, subtipo)
            .input('estadoExpedienteId', sql.Int, estadoExpedienteId)
            .query(`
                UPDATE Expedientes
                SET
                    descripcion = @descripcion,
                    tipo = @tipo,
                    subtipo = @subtipo,
                    EstadoExpediente_id = @estadoExpedienteId
                WHERE id = @id
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Expediente no encontrado' });
        }

        res.status(200).json({ message: 'Expediente actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar el expediente:', error);
        res.status(500).json({ error: 'Error al actualizar el expediente' });
    }
});

// Eliminar un expediente por ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await getConnection();

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                DELETE FROM Expedientes
                WHERE id = @id
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Expediente no encontrado' });
        }

        res.status(200).json({ message: 'Expediente eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el expediente:', error);
        res.status(500).json({ error: 'Error al eliminar el expediente' });
    }
});

module.exports = router;
