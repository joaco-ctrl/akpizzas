const conexion = require('../config/database');

function listarPedidos(callback) {
    const query = `SELECT pe.id, pe.fecha, pe.subtotal, pe.costo_envio, pe.total,
            pe.direccion, pe.metodo_entrega, pe.metodo_pago, pe.estado_pedido,
            pe.estado_pago, u.nombre AS cliente_nombre, u.apellido AS cliente_apellido,
            u.email AS cliente_email, u.telefono AS cliente_telefono,
            d.producto_id, d.cantidad, d.precio_unitario, p.nombre AS producto_nombre
        FROM pedidos pe
        INNER JOIN usuarios u ON u.id = pe.usuario_id
        INNER JOIN detalle_pedido d ON d.pedido_id = pe.id
        LEFT JOIN productos p ON p.id = d.producto_id
        WHERE pe.estado_pedido <> 'PENDIENTE'
        ORDER BY pe.fecha DESC, pe.id DESC, d.id`;
    conexion.query(query, callback);
}

const transicionesPedido = {
    EN_PREPARACION: ['LISTO', 'CANCELADO'],
    LISTO: ['EN_CAMINO', 'ENTREGADO', 'CANCELADO'],
    EN_CAMINO: ['ENTREGADO', 'CANCELADO'],
    ENTREGADO: [],
    CANCELADO: []
};

function actualizarEstadoPedido(idPedido, estado, callback) {
    const selectQuery = `SELECT estado_pedido, metodo_entrega FROM pedidos
        WHERE id = ? AND estado_pedido <> 'PENDIENTE'
          AND EXISTS (SELECT 1 FROM detalle_pedido WHERE pedido_id = pedidos.id)`;
    conexion.query(selectQuery, [idPedido], (error, pedidos) => {
        if (error) return callback(error);
        if (!pedidos.length) return callback(null, { exists: false });

        const pedido = pedidos[0];
        if (pedido.estado_pedido === estado) return callback(null, { unchanged: true });
        const allowed = transicionesPedido[pedido.estado_pedido] || [];
        const entregaLocal = pedido.metodo_entrega === 'RETIRO_LOCAL';
        const estadoPermitido = allowed.includes(estado) &&
            !(entregaLocal && estado === 'EN_CAMINO') &&
            !(!entregaLocal && estado === 'ENTREGADO' && pedido.estado_pedido !== 'EN_CAMINO');
        if (!estadoPermitido) {
            const transitionError = new Error('La transición de estado no está permitida.');
            transitionError.status = 409;
            return callback(transitionError);
        }

        const updateQuery = `UPDATE pedidos SET estado_pedido = ?
            WHERE id = ? AND estado_pedido = ?`;
        conexion.query(updateQuery, [estado, idPedido, pedido.estado_pedido], (updateError, resultado) => {
            if (updateError) return callback(updateError);
            if (!resultado.affectedRows) {
                const transitionError = new Error('El pedido cambió mientras se actualizaba. Recargá e intentá nuevamente.');
                transitionError.status = 409;
                return callback(transitionError);
            }
            callback(null, resultado);
        });
    });
}

module.exports = { listarPedidos, actualizarEstadoPedido };
