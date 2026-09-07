const express = require('express');
const {
    agregar,
    listar,
    modificarCantidad,
    calcularTotal
} = require('../controllers/cartController');
const { verificarToken } = require('../middlewares/auth');

const router = express.Router();
router.use(verificarToken);

router.post('/carrito', agregar);
router.get('/carrito', listar);
router.put('/carrito/:idDetalle', modificarCantidad);
router.get('/pedido/:idPedido/total', calcularTotal);

module.exports = router;