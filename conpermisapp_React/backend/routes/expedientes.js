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
        res.status(500).json({ error: 'Error al obtener los subtipos de expedientes' });
    }
});

// GET expedientes con :id
router.get('/:id', async (req, res) => {
    const { id } = req.params; // Extraer el ID de los parámetros de la URL

    try {
        const pool = await getConnection();

        // Consulta SQL para obtener un expediente por ID
        const result = await pool.request()
            .input('id', sql.Int, id) // Usar un parámetro seguro
            .query(`
                SELECT 
                    e.id AS expedienteId,
                    e.descripcion,
                    e.tipo,
                    e.subtipo,
                    e.estadoExpedienteId,
                    e.fechaCreacion,
                    p.rut AS propietarioRut,
                    p.nombres AS propietarioNombres,
                    p.apellidos AS propietarioApellidos,
                    p.telefono AS propietarioTelefono,
                    pr.rolSII AS propiedadRolSII,
                    pr.direccion AS propiedadDireccion,
                    pr.comuna AS propiedadComuna,
                    pr.region AS propiedadRegion
                FROM Expedientes e
                LEFT JOIN Propietario p ON e.propietario_rut = p.rut
                LEFT JOIN Propiedad pr ON e.propiedad_id = pr.id
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





//  POST crear un nuevo expediente
router.post('/', async (req, res) => {
    const {
        descripcion,
        tipo,
        subtipo,
        propietario,
        usuarioRut,
        estadoExpedienteId,
        propiedad,
    } = req.body;

    if (!propietario || !usuarioRut || !propiedad) {
        return res.status(400).json({ error: "Faltan datos obligatorios." });
    }

    try {
        const pool = await getConnection();

        // Verificar si el propietario existe
        const propietarioExistente = await pool.request()
            .input("rut", sql.VarChar, propietario.rut)
            .query("SELECT * FROM Propietario WHERE rut = @rut");

        if (propietarioExistente.recordset.length === 0) {
            // Crear propietario si no existe
            await pool.request()
                .input("rut", sql.VarChar, propietario.rut)
                .input("nombres", sql.VarChar, propietario.nombres)
                .input("apellidos", sql.VarChar, propietario.apellidos || null)
                .input("email", sql.VarChar, propietario.email || null)
                .input("telefono", sql.Int, propietario.telefono || null)
                .query(`
                    INSERT INTO Propietario (
                        rut,
                        nombres,
                        apellidos,
                        email,
                        telefono
                    ) VALUES (
                        @rut,
                        @nombres,
                        @apellidos,
                        @email,
                        @telefono
                    )
                `);
        }

        // Crear la propiedad
        const resultPropiedad = await pool.request()
            .input('direccion', sql.VarChar, propiedad.direccion)
            .input('numero', sql.Int, propiedad.numero)
            .input('comuna', sql.VarChar, propiedad.comuna)
            .input('region', sql.VarChar, propiedad.region)
            .input('rolSII', sql.VarChar, propiedad.rolSII)
            .query(`
                INSERT INTO Propiedad (
                    direccion,
                    numero,
                    comuna,
                    region,
                    rolSII)
                OUTPUT Inserted.id
                VALUES (
                    @direccion,
                    @numero,
                    @comuna,
                    @region,
                    @rolSII
                )
            `);

        const propiedadId = resultPropiedad.recordset[0].id;

        // // Crear el arquitecto patrocinante
        // const resultArquitecto = await pool.request()
        //     .input('nombre', sql.VarChar, arquitectoPatrocinante.nombre)
        //     .input('rut', sql.VarChar, arquitectoPatrocinante.rut)
        //     .input('telefono', sql.VarChar, arquitectoPatrocinante.telefono)
        //     .input('email', sql.VarChar, arquitectoPatrocinante.email)
        //     .query(`
        //         INSERT INTO ArquitectoPatrocinante (
        //             nombre,
        //             rut,
        //             telefono,
        //             email)
        //         OUTPUT Inserted.id
        //         VALUES (
        //             @nombre,
        //             @rut,
        //             @telefono,
        //             @email
        //         )
        //     `);

        // const arquitectoId = resultArquitecto.recordset[0].id;

        // Crear el expediente
        await pool.request()
            .input("descripcion", sql.VarChar, descripcion)
            .input("tipo", sql.VarChar, tipo)
            .input("subtipo", sql.VarChar, subtipo)
            .input("usuarioRut", sql.VarChar, usuarioRut)
            .input("estadoExpedienteId", sql.Int, estadoExpedienteId)
            .input("propietarioRut", sql.VarChar, propietario.rut)
            .input("propiedadId", sql.Int, propiedadId)
            // .input("arquitectoId", sql.Int, arquitectoId)
            .query(`
                INSERT INTO Expedientes (
                    descripcion,
                    tipo,
                    subtipo,
                    Usuario_rut,
                    EstadoExpediente_id,
                    Propietario_rut,
                    Propiedad_id
                ) VALUES (
                    @descripcion,
                    @tipo,
                    @subtipo,
                    @usuarioRut,
                    @estadoExpedienteId
                    @propietarioRut,
                    @propiedadId,

                )
            `);

        res.status(201).json({ message: "Expediente creado exitosamente." });
    } catch (err) {
        console.error("Error al crear el expediente:", err);
        res.status(500).json({ error: "Error al crear el expediente." });
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



// POST nuevo expediente ajustado a los datos enviados desde el frontend
router.post('/simple', async (req, res) => {
    const { propiedad, propietario } = req.body;

    if (!propiedad || !propietario) {
        return res.status(400).json({ error: "Faltan datos obligatorios: propiedad o propietario." });
    }

    try {
        const pool = await getConnection();

        // Verificar si el propietario existe
        const propietarioExistente = await pool.request()
            .input("rut", sql.VarChar, propietario.rut)
            .query("SELECT * FROM Propietario WHERE rut = @rut");

        if (propietarioExistente.recordset.length === 0) {
            // Crear propietario si no existe
            await pool.request()
                .input("rut", sql.VarChar, propietario.rut)
                .input("nombres", sql.VarChar, propietario.nombres)
                .input("apellidos", sql.VarChar, propietario.apellidos || null)
                .input("email", sql.VarChar, propietario.email || null)
                .input("telefono", sql.Int, propietario.telefono || null)
                .query(`
                    INSERT INTO Propietario (
                        rut,
                        nombres,
                        apellidos,
                        email,
                        telefono
                    ) VALUES (
                        @rut,
                        @nombres,
                        @apellidos,
                        @email,
                        @telefono
                    )
                `);
        }

        // Crear la propiedad
        const resultPropiedad = await pool.request()
            .input("direccion", sql.VarChar, propiedad.direccion)
            .input("numero", sql.Int, propiedad.numero)
            .input("comuna", sql.VarChar, propiedad.comuna)
            .input("region", sql.VarChar, propiedad.region)
            .input("rolSII", sql.VarChar, propiedad.rolSII)
            .query(`
                INSERT INTO Propiedad (
                    direccion,
                    numero,
                    comuna,
                    region,
                    rolSII
                ) OUTPUT Inserted.id VALUES (
                    @direccion,
                    @numero,
                    @comuna,
                    @region,
                    @rolSII
                )
            `);

        const propiedadId = resultPropiedad.recordset[0].id;

        // Crear el expediente
        const resultExpediente = await pool.request()
            .input("propietarioRut", sql.VarChar, propietario.rut)
            .input("propiedadId", sql.Int, propiedadId)
            .query(`
                INSERT INTO Expedientes (
                    Propietario_rut,
                    Propiedad_id
                ) OUTPUT Inserted.id VALUES (
                    @propietarioRut,
                    @propiedadId
                )
            `);

        const expedienteId = resultExpediente.recordset[0].id;

        res.status(201).json({ message: "Expediente creado exitosamente.", expedienteId });
    } catch (err) {
        console.error("Error al crear el expediente:", err);
        res.status(500).json({ error: "Error al crear el expediente." });
    }
});






// Exportar directamente el router
module.exports = router;