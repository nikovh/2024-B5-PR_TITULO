const express = require('express');
const { getConnection, sql } = require('../db');
const router = express.Router();


// POST nuevo usuario
router.post('/', async (req, res) => {
    console.log("Datos recibidos en el backend:", req.body);
    const { 
        rut,
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        telefono,
        email,
        password,
        profesion,
    } = req.body;

    //validar campos obligatorios
    if (!rut || !nombre || !telefono || !email || !password || !profesion ) {
        return res.status(400).json({ error: "Completa los campos obligatorios."});
    }

    try {
        const pool = await getConnection();

        // Validar si el rut o el email ya existen
        const usuarioExistente = await pool.request()
            .input("rut", sql.VarChar, rut)
            .input("email", sql.VarChar, email)
            .query("SELECT * FROM Usuario WHERE rut = @rut OR email = @email");

        if (usuarioExistente.recordset.length > 0) {
            return res.status(400).json({ error: "El RUT o correo electrónico ya está registrado." });
        }

        await pool.request()
            .input("rut", sql.VarChar, rut)
            .input("nombre", sql.VarChar, nombre)
            .input("apellidoPaterno", sql.VarChar, apellidoPaterno)
            .input("apellidoMaterno", sql.VarChar, apellidoMaterno)
            .input("telefono", sql.VarChar, telefono)
            .input("email", sql.VarChar, email)
            .input("password", sql.VarChar, password)
            .input("profesion", sql.VarChar, profesion)
            .query(`
                INSERT INTO Usuario (
                    rut, 
                    nombre, 
                    apellidoPaterno, 
                    apellidoMaterno, 
                    telefono, 
                    email, 
                    password, 
                    profesion)
                VALUES (
                    @rut, 
                    @nombre, 
                    @apellidoPaterno, 
                    @apellidoMaterno, 
                    @telefono, 
                    @email, 
                    @password, 
                    @profesion)
                `);
        res.status(201).json({ message: "Usuario registrado exitosamente." });
    } catch (err) {
        console.error("Error al registrar el usuario:", err);

        if (err.code === 'EREQUEST' && err.message.includes('duplicate')) {
            return res.status(400).json({ error: "El RUT o correo electrónico ya está registrado." });
        }

        res.status(500).json({ error: "Error al registrar al usuario." });
    }
});


// GET todos los usuarios
router.get('/', async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT * FROM Usuario');
        res.status(200).json(result.recordset); // Enviar los datos como JSON
    } catch (err) {
        console.error("Error al obtener usuarios:", err);
        res.status(500).json({ error: "Error al obtener usuarios." });
    }
});


// GET usuario por rut
router.get('/:rut', async (req, res) => {
    const { rut } = req.params;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("rut", sql.VarChar, rut)
            .query('SELECT * FROM Usuario WHERE rut = @rut');

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }

        res.status(200).json(result.recordset[0]);
    } catch (err) {
        console.error("Error al obtener usuario:", err);
        res.status(500).json({ error: "Error al obtener usuario." });
    }
});

// GET usuario por email
router.get('/email/:email', async (req, res) => {
    const {email} = req.params;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("email", sql.VarChar, email)
            .query('SELECT * FROM Usuario WHERE email = @email');
        
        if (result.recordset.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }

        res.status(200).json(result.recordset[0]);
    } catch (err) {
        console.error("Error al obtener usuario por email:", err);
        res.status(500).json({ error: "Error al obtener usuario por email."});
    }
});


module.exports = router;