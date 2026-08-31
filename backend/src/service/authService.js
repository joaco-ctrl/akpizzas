const conexion = require('../config/db');

function login(data, callback) {
    const { email, password } = data;
    const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
    conexion.query(query, [email, password], (error, results) => {
        if (error) {
            callback(error, null);
        } else {
            callback(null, results);
        }
    });
}