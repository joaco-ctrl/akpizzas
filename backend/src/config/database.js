
const mysql = require('mysql');
const conexion = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD|| '',
    database: process.env.DB_NAME || 'akpizzas',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0
});

conexion.getConnection((error, connection) => {
    if (error) {
        console.error('No se pudo conectar a MySQL:', error.message);
        return;
    }

    console.log('Conectado a la base de datos');
    connection.release();
});

module.exports = conexion;