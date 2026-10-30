const jwt = require('jsonwebtoken');
const authService = require('../service/authService');

function verificarToken(req, res, next) {
    const authorization = req.headers.authorization;
    const token = authorization && authorization.startsWith('Bearer ')
        ? authorization.slice(7)
        : null;

    if (!token) {
        return res.status(401).json({ error: 'Token requerido' });
    }

    try {
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ error: 'La autenticación no está configurada' });
        }
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if (!Number.isInteger(payload.id) || payload.id < 1) {
            return res.status(401).json({ error: 'Token inválido o expirado' });
        }
        authService.obtenerPerfil(payload.id, (error, usuarios) => {
            if (error) return res.status(500).json({ error: 'No se pudo validar la sesión' });
            if (!usuarios.length) return res.status(401).json({ error: 'La cuenta ya no está activa' });
            req.usuario = usuarios[0];
            next();
        });
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
}

function verificarAdmin(req, res, next) {
    if (req.usuario.rol !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado' });
    }
    next();
}

module.exports = {
    verificarToken,
    verificarAdmin
};