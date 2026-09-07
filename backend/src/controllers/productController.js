const productService = require('../service/productService');

function listar(req, res) {
    productService.listar((error, productos) => {
        if (error) return res.status(500).json({ error: 'Error al obtener productos' });
        res.json(productos);
    });
}

function crear(req, res) {
    const { nombre, precio, categoria_id } = req.body;
    if (!nombre || precio === undefined || !categoria_id) {
        return res.status(400).json({ error: 'nombre, precio y categoria_id son obligatorios' });
    }
    productService.crear(req.body, (error, resultado) => {
        if (error) return res.status(400).json({ error: error.message });
        res.status(201).json({ mensaje: 'Producto creado correctamente', id: resultado.insertId });
    });
}

function actualizar(req, res) {
    productService.actualizar(req.params.id, req.body, (error, resultado) => {
        if (error) return res.status(400).json({ error: error.message });
        if (!resultado.affectedRows) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json({ mensaje: 'Producto actualizado correctamente' });
    });
}

function eliminar(req, res) {
    productService.eliminar(req.params.id, (error, resultado) => {
        if (error) return res.status(500).json({ error: 'Error al eliminar producto' });
        if (!resultado.affectedRows) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json({ mensaje: 'Producto eliminado correctamente' });
    });
}

module.exports = { listar, crear, actualizar, eliminar };