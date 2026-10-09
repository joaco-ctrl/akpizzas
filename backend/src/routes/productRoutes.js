const express = require('express');
const {
    listar,
    listarAdmin,
    listarCategorias,
    crearCategoria,
    crear,
    actualizar,
    eliminar
} = require('../controllers/productController');
const { verificarToken, verificarAdmin } = require('../middlewares/auth');

const router = express.Router();

router.get('/categorias', listarCategorias);
router.post('/categorias', verificarToken, verificarAdmin, crearCategoria);
router.get('/productos', listar);
router.get('/admin/productos', verificarToken, verificarAdmin, listarAdmin);
router.post('/productos', verificarToken, verificarAdmin, crear);
router.put('/productos/:id', verificarToken, verificarAdmin, actualizar);
router.delete('/productos/:id', verificarToken, verificarAdmin, eliminar);

module.exports = router;