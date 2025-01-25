const express = require('express');
const { getConnection, sql } = require('../db');

const router = express.Router();

//--------- RUTAS ---------//


/* GET /expedientes
  - Si NO se pasa ningún parámetro retorna TODOS los expedientes
  - Si se pasa "?usuario_email=xxxx" filtra por usuario_email
*/
router.get('/', async (req, res) => {
    const usuarioEmail = req.query.usuario_email;
    try {
        const pool = await getConnection();

        // Validar que se recibe el parámetro
        if (!usuarioEmail) {
            console.error("El parámetro 'usuario_email' no fue proporcionado.");
            return res.status(400).json({ error: "El parámetro 'usuario_email' es obligatorio." });
        }

        //Validar que el email exista en la tabla Usuario
        const usuarioCheck = await pool.request()
            .input('email', sql.VarChar, usuarioEmail)
            .query('SELECT email FROM Usuario WHERE email = @email');

        if (usuarioCheck.recordset.length === 0) {
            console.log(`El email ${usuarioEmail} no está registrado en la base de datos.`);
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        console.log(`Parámetro recibido: usuario_email=${usuarioEmail}`);

        // Filtrar por Usuario_email excluyendo NULL
        const query = usuarioEmail
            ? `
                SELECT *
                FROM Expedientes
                WHERE Usuario_email = @usuarioEmail
              `
            : `
                SELECT *
                FROM Expedientes
              `;

        // Ejecutar la consulta
        const result = await pool.request()
            .input('usuarioEmail', sql.VarChar, usuarioEmail || null)
            .query(query);

        // Verificar el resultado
        if (result.recordset.length === 0) {
            console.log(`No se encontraron expedientes para usuario_email=${usuarioEmail}`);
            return res.status(200).json([]);
        }

        console.log(`Expedientes encontrados: ${result.recordset.length}`);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("Error al obtener expedientes:", error);
        res.status(500).json({ error: "Error al obtener expedientes" });
    }
});


// GET /expedientes con JOIN - Obtener expedientes todos los expedientes
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
        res.status(500).json({ error: 'Error al obtener los subtipos de expedientes' });
    }
});



// GET expedientes con :id
router.get('/:id', async (req, res) => {
    const { id } = req.params; // Extraer el ID de los parámetros de la URL

    try {
        const pool = await getConnection();

        // Consulta SQL para obtener un expediente por ID incluyendo el tipoEstado
        const result = await pool.request()
            .input('id', sql.Int, id) // Usar un parámetro seguro
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
                    p.apellidos AS propietarioApellidos
                FROM Expedientes e
                LEFT JOIN Propietario p ON e.Propietario_rut = p.rut
                LEFT JOIN EstadoExpediente ee ON e.EstadoExpediente_id = ee.id
                WHERE e.id = @id
            `);

        // Si no se encuentra el expediente, retornar un error 404
        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Expediente no encontrado' });
        }

        // Retornar el expediente encontrado
        res.status(200).json(result.recordset[0]);
    } catch (error) {
        console.error('Error al obtener el expediente:', error);
        res.status(500).json({ error: 'Error al obtener el expediente' });
    }
});



// // POST descripcion y usuario, propietario
// router.post('/', async (req, res) => {
//     const { descripcion, usuarioEmail, tipo, subtipo, propietario, esNuevoPropietario } = req.body;

//     console.log("Datos recibidos:", { descripcion, usuarioEmail, tipo, subtipo, propietario, esNuevoPropietario });

//     try {
//         const pool = await getConnection();
//         console.log("Conexión con la base de datos establecida.");

//         if(esNuevoPropietario) {
//             // Verificar propietario
//             const propietarioCheck = await pool.request()
//                 .input("rut", sql.VarChar, propietario.rut)
//                 .query("SELECT rut FROM Propietario WHERE rut = @rut");

//             if(propietarioCheck.recordset.length === 0) {
//                 //crear propietario
//                 await pool.request()
//                     .input("rut", sql.VarChar, propietario.rut)
//                     .input("nombres", sql.VarChar, propietario.nombres)
//                     .input("apellidos", sql.VarChar, propietario.apellidos)
//                     .input("email", sql.VarChar, propietario.email)
//                     .input("telefono", sql.VarChar, propietario.telefono)
//                     .query(`
//                         INSERT INTO Propietario (rut, nombres, apellidos, email, telefono)
//                         VALUES (@rut, @nombres, @apellidos, @email, @telefono)
//                     `);
//                 console.log("Nuevo propietario creado:", propietario);
//             }
//         }

//         // Crear el expediente
//         const expedienteResult = await pool.request()
//             .input("descripcion", sql.VarChar, descripcion)
//             .input("usuarioEmail", sql.VarChar, usuarioEmail)
//             .input("tipo", sql.VarChar, tipo)
//             .input("subtipo", sql.VarChar, subtipo)
//             .input("propietarioRut", sql.VarChar, propietario.rut)
//             .input("estadoExpedienteId", sql.Int, 1) // Valor por defecto
//             .query(`
//                 INSERT INTO Expedientes (descripcion, Usuario_email, tipo, subtipo, Propietario_rut)
//                 OUTPUT Inserted.id
//                 VALUES (@descripcion, @usuarioEmail, @tipo, @subtipo, @propietarioRut)
//             `);

//         const expedienteId = expedienteResult.recordset[0].id;
//         console.log("Expediente creado con ID:", expedienteId);

//         if (!expedienteId) {
//             console.error("No se pudo obtener el ID del expediente.");
//             return res.status(500).json({ error: "No se pudo crear el expediente correctamente." });
//         }

//         console.log("Expediente creado con ID:", expedienteId);

//         res.status(201).json({
//             message: "Expediente creado exitosamente.",
//             id: expedienteId, 
//         });
//     } catch (err) {
//         console.error("Error al crear el expediente:", err);
//         res.status(500).json({ error: "Error al crear el expediente." });
//     }
// });


router.post('/', async (req, res) => {
    const { descripcion, tipo, subtipo, propietario, propiedad } = req.body;

    let transaction;

    try {
        const pool = await getConnection();

        // Inicia una transacción
        transaction = pool.transaction();
        await transaction.begin();
        console.log('--- Transacción iniciada ---');

        // Inserta el expediente
        console.log('Insertando expediente...');
        const expedienteResult = await transaction.request()
            .input('descripcion', sql.VarChar, descripcion)
            .input('tipo', sql.VarChar, tipo)
            .input('subtipo', sql.VarChar, subtipo)
            .input('propietarioRut', sql.VarChar, propietario.rut)
            .query(`
                INSERT INTO Expedientes (Descripcion, Tipo, Subtipo, Propietario_Rut)
                OUTPUT INSERTED.ID
                VALUES (@descripcion, @tipo, @subtipo, @propietarioRut)
            `);

        const expedienteId = expedienteResult.recordset[0].ID;
        console.log('Expediente creado con ID:', expedienteId);

        // Inserta la propiedad asociada al expediente
        console.log('Insertando propiedad asociada al expediente...');
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
                INSERT INTO Propiedad (RolSII, Direccion, Numero, Comuna, Region, InscFojas, InscNumero, InscYear, NumPisos, M2, Destino, Expediente_id)
                VALUES (@rolSII, @direccion, @numero, @comuna, @region, @inscFojas, @inscNumero, @inscYear, @numPisos, @m2, @destino, @expedienteId)
            `);

        console.log('Propiedad asociada creada correctamente.');

        // Confirma la transacción
        await transaction.commit();
        console.log('--- Transacción confirmada ---');

        res.status(201).json({ id: expedienteId });
    } catch (error) {
        console.error('Error durante la transacción:', error);

        if (transaction) {
            await transaction.rollback();
            console.log('--- Transacción revertida ---');
        }

        res.status(500).json({ error: 'Error al crear el expediente.' });
    }
});



// Crear expediente y propiedad asociada
router.post('/expedientes', async (req, res) => {
    const { descripcion, tipo, subtipo, propietario, propiedad } = req.body;
    try {
        // Crear expediente
        const expediente = await db.Expedientes.create({
            descripcion,
            tipo,
            subtipo,
            propietarioRut: propietario.rut,
            EstadoExpediente_id: 1,
        });

        // Crear propiedad asociada
        if (propiedad) {
            await db.Propiedad.create({
                ...propiedad,
                expedienteId: expediente.id, // Asociar al expediente
            });
        }

        res.status(201).json({ id: expediente.id });
    } catch (err) {
        console.error('Error al crear expediente:', err);
        res.status(500).json({ error: 'Error al crear expediente y propiedad' });
    }
});



// PUT /expedientes/:id - Actualizar un expediente por ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { descripcion, tipo, subtipo, estadoExpedienteId } = req.body;

    try {
        const pool = await getConnection();

        // Actualizar el expediente
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


// DELETE /expedientes/:id - Eliminar un expediente por ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await getConnection();

        // Eliminar el expediente
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


// Exportar directamente el router
module.exports = router;