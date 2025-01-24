const express = require('express');
const jwt = require('jsonwebtoken');
const admin = require("../firebaseAdmin");
const { getConnection, sql } = require("../db");
const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY;



// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         return res.status(400).json({ error: "Por favor, proporciona email y contraseña." });
//     }

//     try {
//         const pool = await getConnection();

//         // Verificar usuario en la bd
//         const result = await pool.request()
//             .input("email", sql.VarChar, email)
//             // .input("password", sql.VarChar, password)
//             // .query("SELECT email, rol, password FROM Usuario WHERE email = @email AND password = @password");
//             .query("SELECT email, rol, password FROM Usuario WHERE email = @email");

//         if (result.recordset.length === 0) {
//             return res.status(401).json({ error: "Usuario no encontrado" });
//         }

//         // validar contraseña
//         const usuario = result.recordset[0];

//         if (usuario.password !== password) {
//             return res.status(401).json({ error: "Credenciales incorrectas." });
//         }
        

//         // Crear el token JWT
//         const token = jwt.sign(
//             { email: usuario.email, rol: usuario.rol },
//             process.env.SECRET_KEY,
//             { expiresIn: "1h" } // Token válido por 1 hora
//         );

//         res.status(200).json({ token, rol: usuario.rol });
//     } catch (err) {
//         console.error("Error al procesar el inicio de sesión:", err);
//         res.status(500).json({ error: "Error en el servidor." });
//     }
// });


router.post("/login", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "No se proporcionó token." });
    }

    try {
        // Verificar el token de Firebase
        const decodedToken = await admin.auth().verifyIdToken(token);
        const email = decodedToken.email;

        // Verificar si el usuario existe en la base de datos
        const pool = await getConnection();
        const result = await pool.request()
            .input("email", sql.VarChar, email)
            .query("SELECT email, rol FROM Usuario WHERE email = @email");

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }

        const usuario = result.recordset[0];
        res.status(200).json({ token, rol: usuario.rol });
    } catch (err) {
        console.error("Error al verificar el token:", err);
        res.status(401).json({ error: "Token inválido o expirado." });
    }
});


module.exports = router;