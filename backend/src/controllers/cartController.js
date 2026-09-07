const cartService = require('../service/cartService');

function agregar(req, res) {
    const { idProducto, cantidad } = req.body;
    if (!Number.isInteger(idProducto) || !Number.isInteger(cantidad) || cantidad < 1) {
        return res.status(400).json({ error: 'idProducto y cantidad deben ser enteros válidos' });
    }
    cartService.agregar(req.usuario.id, idProducto, cantidad, (error, resultado) => {
        if (error) return res.status(error.status || 500).json({ error: error.status ? error.message : 'Error al agregar al carrito' });
        res.status(201).json({ mensaje: 'Producto agregado correctamente', idDetalle: resultado.insertId });
    });
}

function listar(req, res) {
    cartService.listar(req.usuario.id, (error, detalles) => {
        if (error) return res.status(500).json({ error: 'Error al obtener el carrito' });
        res.json(detalles);
    });
}

function modificarCantidad(req, res) {
    const cantidad = req.body.cantidad;
    if (!Number.isInteger(cantidad) || cantidad < 1) {
        return res.status(400).json({ error: 'cantidad debe ser un entero mayor que cero' });
    }
    cartService.modificarCantidad(req.usuario.id, req.params.idDetalle, cantidad, error => {
        if (error) return res.status(error.status || 500).json({ error: error.status ? error.message : 'Error al modificar cantidad' });
        res.json({ mensaje: 'Cantidad modificada correctamente' });
    });
}

function calcularTotal(req, res) {
    cartService.calcularTotal(req.usuario.id, req.params.idPedido, (error, resultados) => {
        if (error) return res.status(500).json({ error: 'Error al calcular el total' });
        if (!resultados.length) return res.status(404).json({ error: 'Pedido no encontrado' });
        res.json({ idPedido: resultados[0].id, total: Number(resultados[0].total) });
    });
}

module.exports = { agregar, listar, modificarCantidad, calcularTotal };