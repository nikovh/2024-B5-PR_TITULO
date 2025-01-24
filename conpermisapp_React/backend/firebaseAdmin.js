// require('dotenv').config();
// const admin          = require('firebase-admin');
// const serviceAccount = require('./config/firebaseServiceKey.json');
// const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_KEY);

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     storageBucket: "conpermisapp.firebasestorage.app"
// });

// module.exports = admin;


const admin = require("firebase-admin");

// Verifica si `admin` ya ha sido inicializado
if (!admin.apps.length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_KEY);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

module.exports = admin;
