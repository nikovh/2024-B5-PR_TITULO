const admin          = require('firebase-admin');
const serviceAccount = require('./config/firebaseServiceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "conpermisapp.firebasestorage.app"
});

module.exports = admin;


