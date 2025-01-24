const sql = require('mssql');

const dbConfig = {
  user: process.env.DB_USER || "admin_conpermisapp",
  password: process.env.DB_PASS || "Modelamiento1!",
  server: process.env.DB_SERVER || "Nicolas\\SQLEXPRESS",
  database: process.env.DB_DATABASE || "ConpermisappDB",
  port: parseInt(process.env.DB_PORT) || 4000,
  
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

async function getConnection() {
  try {
    const pool = await sql.connect(dbConfig);
    console.log("Conexión exitosa a la base de datos");
    return pool;
  } catch (err) {
    console.error('Error de conexión:', err);
    throw err;
  }
}

module.exports = { getConnection, sql };