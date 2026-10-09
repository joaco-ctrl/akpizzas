const express = require('express');
const {
    agregar,
    listar,
    eliminar,
    modificarCantidad,
    listarPedidos,
    calcularTotal,
    actualizarEntrega
} = require('../controllers/cartController');
const { verificarToken } = require('../middlewares/auth');

const router = express.Router();
router.use(verificarToken);

router.post('/carrito', agregar);
router.get('/carrito', listar);
router.delete('/carrito/:idDetalle', eliminar);
router.put('/carrito/:idDetalle', modificarCantidad);
router.get('/pedido/:idPedido/total', calcularTotal);
router.get('/pedidos', listarPedidos);
router.put('/actualizar-entrega', actualizarEntrega);

module.exports = router;