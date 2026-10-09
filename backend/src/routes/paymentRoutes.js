const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { verificarToken } = require('../middlewares/auth');

// Crear preferencia (requiere login)
router.post('/crear-preferencia', verificarToken, paymentController.crearPreferencia);

// Webhook (público para recibir notificaciones)
router.post('/webhook', paymentController.recibirWebhook);

module.exports = router;