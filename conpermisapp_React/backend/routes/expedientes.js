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
                    e.id, 
                    e.fechaCreacion, 
                    e.descripcion, 
                    e.tipo, 
                    e.subtipo, 
                    e.Propietario_rut, 
                    e.Usuario_rut, 
                    e.EstadoExpediente_id,
                    p.nombre AS propietarioNombre,
                    p.apellidoPaterno AS propietarioApellidoPaterno,
                    p.apellidoMaterno AS propietarioApellidoMaterno
                FROM Expedientes e
                LEFT JOIN Propietario p ON e.Propietario_rut = p.rut
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
  

// // POST crear un nuevo expediente 
router.post('/', async (req, res) => {
    const {
        descripcion,
        tipo,
        subtipo,
        propietario,
        usuarioRut,
        estadoExpedienteId
    } = req.body;

    if (!propietario || !usuarioRut) {
        return res.status(400).json({ error: "Completa los campos obligatorios." });
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
                .input("nombre", sql.VarChar, propietario.nombre)
                .input("apellidoPaterno", sql.VarChar, propietario.apellidoPaterno || null)
                .input("apellidoMaterno", sql.VarChar, propietario.apellidoMaterno || null)
                .input("email", sql.VarChar, propietario.email || null)
                .input("telefono", sql.Int, propietario.telefono || null)
                .query(`
                    INSERT INTO Propietario (
                        rut, 
                        nombre, 
                        apellidoPaterno, 
                        apellidoMaterno, 
                        email, 
                        telefono
                    ) VALUES (
                        @rut, 
                        @nombre, 
                        @apellidoPaterno, 
                        @apellidoMaterno, 
                        @email, 
                        @telefono
                    )
                `);
        }

        // Crear el expediente
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
                    EstadoExpediente_id
                ) VALUES (
                    @descripcion, 
                    @tipo, 
                    @subtipo, 
                    @propietarioRut, 
                    @usuarioRut, 
                    @estadoExpedienteId
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



// Exportar directamente el router
module.exports = router;