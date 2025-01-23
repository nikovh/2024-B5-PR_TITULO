const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const SECRET_KEY = '';
const { getConnection, sql } = require("../db");

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Verifica credenciales en la DB
    // ejemplo :
    // if (email === 'nvalenzuelah@alumno.iplacex.cl' && password === 'nicolas') {
    //     // Generar token
    //     const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });

    //     // Retorna token al cliente
    //     return res.json({ token });
    // } else {
    //     return res.status(401).json({ error: 'Credenciales inválidas' });
    // }

    try {
        const pool = await getConnection();

        // Verificar usuario
        const result = await pool
            .request()
            .input("email", sql.VarChar, email)
            .input("password", sql.VarChar, password)
            .query("SELECT email, rol FROM Usuario WHERE email = @email AND password = @password");

        if (result.recordset.length === 0) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        // Retornar información del usuario, incluido el rol
        const usuario = result.recordset[0];
        res.status(200).json(usuario);
    } catch (err) {
        console.error("Error en el login:", err);
        res.status(500).json({ error: "Error en el servidor" });
    }

});

module.exports = router;

