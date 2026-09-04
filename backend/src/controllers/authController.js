const loginservice = require("../service/authService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//LOGIN
function login(req, res) {
    const { email, password } = req.body;
    loginservice.login({ email, password }, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error en la base de datos" });
        }
        if (!results || results.length === 0) {
            return res.status(401).json({ error: "Email o contraseña incorrectos" });
        }

        const token = jwt.sign({ id: results[0].id, email: results[0].email, rol: results[0].rol },
            process.env.JWT_SECRET || "secreto");
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
    const {nombre, apellido, telefono, direccion, email, password } = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({ error: "Error al encriptar contraseña" });
        }
        loginservice.register({ nombre, apellido, telefono, direccion, email, password: hash }, (err, results) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.status(201).json({ mensaje: "Registro exitoso" });
        });
    });
}
//FIN LOGIN

module.exports = {
    login,
    register
};  
