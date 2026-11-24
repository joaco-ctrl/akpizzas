const bcrypt = require('bcrypt');
const passwordResetService = require('../service/passwordResetService');
const passwordResetEmailService = require('../service/passwordResetEmailService');

const genericMessage = 'Si el correo está asociado a una cuenta activa, recibirás instrucciones para restablecer tu contraseña.';

function solicitarRecuperacion(req, res) {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 150) {
        return res.status(400).json({ error: 'Ingresá un email válido.' });
    }
    if (!passwordResetEmailService.isConfigured()) {
        return res.status(503).json({ error: 'El servicio de correo no está configurado. Contactá al administrador.' });
    }

    passwordResetService.createPasswordResetToken(email, async (error, reset) => {
        if (error) {
            console.error('No se pudo iniciar la recuperación de contraseña:', error.message);
            return res.status(500).json({ error: 'No se pudo procesar la solicitud. Intentá nuevamente.' });
        }
        if (!reset) return res.json({ mensaje: genericMessage });

        try {
            await passwordResetEmailService.sendPasswordResetEmail(reset.email, reset.token);
        } catch (sendError) {
            passwordResetService.invalidatePasswordResetToken(reset.tokenHash, invalidateError => {
                if (invalidateError) {
                    console.error('No se pudo invalidar un token de recuperación:', invalidateError.message);
                }
            });
            console.error('No se pudo enviar el correo de recuperación:', sendError.message);
        }
        res.json({ mensaje: genericMessage });
    });
}

function restablecerPassword(req, res) {
    const { token, password } = req.body || {};
    if (typeof token !== 'string' || !/^[a-f0-9]{64}$/i.test(token) ||
        typeof password !== 'string' || password.length < 8 ||
        Buffer.byteLength(password, 'utf8') > 72) {
        return res.status(400).json({
            error: 'El enlace o la contraseña no son válidos. La contraseña debe tener entre 8 y 72 bytes.'
        });
    }

    bcrypt.hash(password, 10, (hashError, passwordHash) => {
        if (hashError) {
            console.error('No se pudo proteger la nueva contraseña:', hashError.message);
            return res.status(500).json({ error: 'No se pudo restablecer la contraseña. Intentá nuevamente.' });
        }

        passwordResetService.resetPassword(token, passwordHash, (error, reset) => {
            if (error) {
                console.error('No se pudo guardar la nueva contraseña:', error.message);
                return res.status(500).json({ error: 'No se pudo restablecer la contraseña. Intentá nuevamente.' });
            }
            if (!reset) {
                return res.status(400).json({ error: 'El enlace venció o ya fue utilizado. Solicitá uno nuevo.' });
            }
            res.json({ mensaje: 'Contraseña restablecida correctamente. Ya podés iniciar sesión.' });
        });
    });
}

module.exports = { solicitarRecuperacion, restablecerPassword };
