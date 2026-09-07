const express = require('express');
const {
    listar,
    crear,
    actualizar,
    eliminar
} = require('../controllers/productController');
const { verificarToken, verificarAdmin } = require('../middlewares/auth');

const router = express.Router();

router.get('/productos',listar);
router.post('/productos', verificarToken, verificarAdmin, crear);
router.put('/productos/:id', verificarToken, verificarAdmin, actualizar);
router.delete('/productos/:id', verificarToken, verificarAdmin, eliminar);

module.exports = router;