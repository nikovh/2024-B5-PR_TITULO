// const express = require('express');
// const jwt = require('jsonwebtoken');
// const admin = require("../firebaseAdmin");
// const { getConnection, sql } = require("../db");
// const router = express.Router();

// const SECRET_KEY = process.env.SECRET_KEY;


// router.post("/login", async (req, res) => {
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) {
//         return res.status(401).json({ error: "No se proporcionó token." });
//     }

//     try {
//         // Verificar el token de Firebase
//         const decodedToken = await admin.auth().verifyIdToken(token);
//         const email = decodedToken.email;

//         // Verificar si el usuario existe en la base de datos
//         const pool = await getConnection();
//         const result = await pool.request()
//             .input("email", sql.VarChar, email)
//             .query("SELECT email, rol FROM Usuario WHERE email = @email");

//         if (result.recordset.length === 0) {
//             return res.status(404).json({ error: "Usuario no encontrado." });
//         }

//         const usuario = result.recordset[0];
//         res.status(200).json({ token, rol: usuario.rol });
//     } catch (err) {
//         console.error("Error al verificar el token:", err);
//         res.status(401).json({ error: "Token inválido o expirado." });
//     }
// });


// module.exports = router;