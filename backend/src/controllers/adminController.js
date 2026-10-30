const adminService = require('../service/adminService');

const estadosPedido = ['EN_PREPARACION', 'LISTO', 'EN_CAMINO', 'ENTREGADO', 'CANCELADO'];

function listarPedidos(req, res) {
    adminService.listarPedidos((error, filas) => {
        if (error) return res.status(500).json({ error: 'No se pudieron cargar los pedidos.' });
        const pedidos = new Map();

        filas.forEach((fila) => {
            if (!pedidos.has(fila.id)) {
                pedidos.set(fila.id, {
                    id: fila.id,
                    fecha: fila.fecha,
                    subtotal: Number(fila.subtotal),
                    costoEnvio: Number(fila.costo_envio),
                    total: Number(fila.total),
                    direccion: fila.direccion,
                    metodoEntrega: fila.metodo_entrega,
                    metodoPago: fila.metodo_pago,
                    estadoPedido: fila.estado_pedido,
                    estadoPago: fila.estado_pago,
                    cliente: {
                        nombre: [fila.cliente_nombre, fila.cliente_apellido].filter(Boolean).join(' '),
                        email: fila.cliente_email,
                        telefono: fila.cliente_telefono
                    },
                    productos: []
                });
            }
            pedidos.get(fila.id).productos.push({
                id: fila.producto_id,
                nombre: fila.producto_nombre || 'Producto eliminado',
                cantidad: Number(fila.cantidad),
                precio: Number(fila.precio_unitario)
            });
        });

        res.json(Array.from(pedidos.values()));
    });
}

function actualizarEstadoPedido(req, res) {
    const idPedido = Number(req.params.id);
    const { estado } = req.body || {};
    if (!Number.isInteger(idPedido) || idPedido < 1 || !estadosPedido.includes(estado)) {
        return res.status(400).json({ error: 'El pedido o el estado indicado no son válidos.' });
    }

    adminService.actualizarEstadoPedido(idPedido, estado, (error, resultado) => {
        if (error) return res.status(error.status || 500).json({ error: error.status ? error.message : 'No se pudo actualizar el estado del pedido.' });
        if (resultado.exists === false) {
            return res.status(404).json({ error: 'No se encontró el pedido.' });
        }
        res.json({ mensaje: 'Estado del pedido actualizado.', estado });
    });
}

module.exports = { listarPedidos, actualizarEstadoPedido };
