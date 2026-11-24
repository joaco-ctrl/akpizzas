const express=require("express");
const router=express.Router();
const { rateLimit } = require('express-rate-limit');

const{
    login,
    register,
    obtenerPerfil
}=require("../controllers/authController");
const {
    solicitarRecuperacion,
    restablecerPassword
} = require('../controllers/passwordResetController');
const { verificarToken } = require("../middlewares/auth");

const recoveryLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Demasiados intentos. Esperá unos minutos e intentá nuevamente.' }
});

const resetLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Demasiados intentos. Esperá unos minutos e intentá nuevamente.' }
});

router.post("/login",login);
router.post("/register",register);
router.post('/password-reset/request', recoveryLimiter, solicitarRecuperacion);
router.post('/password-reset/confirm', resetLimiter, restablecerPassword);
router.get("/me", verificarToken, obtenerPerfil);

module.exports = router;