const mysql = require('mysql');
const conexion = mysql.createConnection({

    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
conexion.connect((error) => {
    if (error) {
        console.log("Error de conexión a MySQL:", error.message)
    }
    else {
        console.log("conectado a la base de datos")
    }
})
module.exports = conexion;