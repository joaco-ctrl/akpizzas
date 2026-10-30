const loginservice = require("../service/authService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function login(req, res) {
    const { email, password } = req.body || {};
    if (typeof email !== 'string' || typeof password !== 'string' ||
        !email.trim() || !password || email.trim().length > 150) {
        return res.status(400).json({ error: 'email y password son obligatorios' });
    }
    loginservice.login({ email: email.trim().toLowerCase(), password }, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error en la base de datos" });
        }
        if (!results || results.length === 0) {
            return res.status(401).json({ error: "Email o contraseña incorrectos" });
        }

        const token = jwt.sign(
            { id: results[0].id, email: results[0].email, rol: results[0].rol },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({
            mensaje: "Login exitoso",
            token: token,
            usuario: {
                email: results[0].email,
                id: results[0].id,
                rol: results[0].rol
            },
            expiresIn: 3600
        });
    });
}

function register(req, res) {
    const { nombre, apellido, telefono, direccion, email, password } = req.body || {};
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const validPhone = telefono == null || typeof telefono === 'string' && telefono.length <= 20;
    const validAddress = direccion == null || typeof direccion === 'string' && direccion.length <= 255;
    if (typeof nombre !== 'string' || !nombre.trim() || nombre.trim().length > 100 ||
        typeof apellido !== 'string' || !apellido.trim() || apellido.trim().length > 100 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) || normalizedEmail.length > 150 ||
        typeof password !== 'string' || password.length < 8 || Buffer.byteLength(password, 'utf8') > 72 ||
        !validPhone || !validAddress) {
        return res.status(400).json({ error: 'Ingresá nombre, apellido, un email válido y una contraseña de entre 8 y 72 bytes.' });
    }
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({ error: "Error al encriptar contraseña" });
        }
        loginservice.register({
            nombre: nombre.trim(),
            apellido: apellido.trim(),
            telefono: telefono || null,
            direccion: direccion || null,
            email: normalizedEmail,
            password: hash
        }, (err, results) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ error: 'Ya existe una cuenta con ese email.' });
                }
                return res.status(500).json({ error: 'No se pudo crear la cuenta. Intentá nuevamente.' });
            }
            res.status(201).json({ mensaje: "Registro exitoso" });
        });
    });
}

function obtenerPerfil(req, res) {
    res.json({ usuario: req.usuario });
}
module.exports = {
    login,
    register,
    obtenerPerfil
};
