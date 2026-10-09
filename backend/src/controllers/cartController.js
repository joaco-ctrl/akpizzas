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

function eliminar(req, res) {
    cartService.eliminar(req.usuario.id, req.params.idDetalle, error => {
        if (error) return res.status(error.status || 500).json({ error: error.status ? error.message : 'Error al eliminar del carrito' });
        res.json({ mensaje: 'Producto eliminado del carrito' });
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

function listarPedidos(req, res) {
    cartService.listarPedidos(req.usuario.id, (error, filas) => {
        if (error) return res.status(500).json({ error: 'Error al obtener los pedidos' });
        const pedidos = new Map();
        filas.forEach(fila => {
            if (!pedidos.has(fila.id)) {
                pedidos.set(fila.id, {
                    id: fila.id,
                    fecha: fila.fecha,
                    total: Number(fila.total),
                    estadoPedido: fila.estado_pedido,
                    estadoPago: fila.estado_pago,
                    productos: []
                });
            }
            if (fila.producto_id) {
                pedidos.get(fila.id).productos.push({
                    id: fila.producto_id,
                    nombre: fila.nombre,
                    cantidad: Number(fila.cantidad),
                    precio: Number(fila.precio_unitario)
                });
            }
        });
        res.json(Array.from(pedidos.values()));
    });
}


function actualizarEntrega(req, res) {
    const { idPedido, metodoEntrega, metodoPago, direccion, costoEnvio = 0 } = req.body;
    if (!Number.isInteger(Number(idPedido)) || !['DELIVERY', 'RETIRO_LOCAL'].includes(metodoEntrega) ||
        metodoPago !== 'EFECTIVO' || !Number.isFinite(Number(costoEnvio)) || Number(costoEnvio) < 0) {
        return res.status(400).json({ error: 'Los datos de entrega o pago no son válidos' });
    }
    if (metodoEntrega === 'DELIVERY' && !direccion) {
        return res.status(400).json({ error: 'La dirección es obligatoria para delivery' });
    }

    cartService.actualizarEntrega(req.usuario.id, Number(idPedido), metodoEntrega, metodoPago, direccion || null, Number(costoEnvio), (error, resultado) => {
        if (error) return res.status(500).json({ error: 'Error al actualizar el método de entrega' });
        if (!resultado.affectedRows) return res.status(404).json({ error: 'Pedido pendiente no encontrado' });
        res.json({ mensaje: 'Datos de entrega actualizados correctamente' });
    });
}

module.exports = { agregar, listar, eliminar, modificarCantidad, listarPedidos, calcularTotal, actualizarEntrega };