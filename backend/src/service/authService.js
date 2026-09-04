const conexion = require('../config/database');
const bcrypt = require('bcrypt');

function login(data, callback) {
    const { email, password } = data;
    const query = 'SELECT * FROM usuarios WHERE email = ?';
    conexion.query(query, [email], (error, results) => {
        if (error) {
            callback(error, null);
            return;
        }

        if (!results || results.length === 0 || !results[0].password) {
            callback(null, []);
            return;
        }

        bcrypt.compare(password, results[0].password, (compareError, isValid) => {
            if (compareError) {
                callback(compareError, null);
                return;
            }
            callback(null, isValid ? results : []);
        });
    });
}

function register(data, callback) {
    const { nombre, apellido, telefono, direccion, email, password } = data;
    const query = 'INSERT INTO usuarios (nombre, apellido, telefono, direccion, email, password) VALUES (?, ?, ?, ?, ?, ?)';
    conexion.query(query, [nombre, apellido, telefono, direccion, email, password], (error, results) => {
        if(error) {
            callback(error, null);
        } else {
            callback(null, results);
        }
    });
}

module.exports = {
    login,
    register
};