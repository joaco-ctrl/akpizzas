const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
    const authorization = req.headers.authorization;
    const token = authorization && authorization.startsWith('Bearer ')
        ? authorization.slice(7)
        : null;

    if (!token) {
        return res.status(401).json({ error: 'Token requerido' });
    }

    try {
        req.usuario = jwt.verify(token, process.env.JWT_SECRET || 'secreto');
        next();
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