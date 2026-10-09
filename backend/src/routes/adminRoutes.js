const express = require('express');
const { listarPedidos, actualizarEstadoPedido } = require('../controllers/adminController');
const { verificarToken, verificarAdmin } = require('../middlewares/auth');

const router = express.Router();
router.use(verificarToken, verificarAdmin);

router.get('/pedidos', listarPedidos);
router.put('/pedidos/:id/estado', actualizarEstadoPedido);

module.exports = router;
