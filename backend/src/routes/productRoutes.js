const express = require('express');
const {
    listar,
    listarAdmin,
    listarCategorias,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
    crear,
    actualizar,
    eliminar
} = require('../controllers/productController');
const { verificarToken, verificarAdmin } = require('../middlewares/auth');
const { uploadProductImage } = require('../middlewares/uploadProductImage');

const router = express.Router();

router.get('/categorias', listarCategorias);
router.post('/categorias', verificarToken, verificarAdmin, crearCategoria);
router.put('/categorias/:id', verificarToken, verificarAdmin, actualizarCategoria);
router.delete('/categorias/:id', verificarToken, verificarAdmin, eliminarCategoria);
router.get('/productos', listar);
router.get('/admin/productos', verificarToken, verificarAdmin, listarAdmin);
router.post('/productos', verificarToken, verificarAdmin, uploadProductImage, crear);
router.put('/productos/:id', verificarToken, verificarAdmin, uploadProductImage, actualizar);
router.delete('/productos/:id', verificarToken, verificarAdmin, eliminar);

module.exports = router;