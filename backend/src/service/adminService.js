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

function actualizarEstadoPedido(idPedido, estado, callback) {
    const query = `UPDATE pedidos SET estado_pedido = ?
        WHERE id = ? AND estado_pedido <> 'PENDIENTE'`;
    conexion.query(query, [estado, idPedido], (error, resultado) => {
        if (error) return callback(error);
        if (resultado.affectedRows) return callback(null, resultado);

        conexion.query(
            `SELECT id FROM pedidos
             WHERE id = ? AND estado_pedido <> 'PENDIENTE'
               AND EXISTS (SELECT 1 FROM detalle_pedido WHERE pedido_id = pedidos.id)`,
            [idPedido],
            (lookupError, pedidos) => {
                if (lookupError) return callback(lookupError);
                callback(null, { ...resultado, exists: pedidos.length > 0 });
            }
        );
    });
}

module.exports = { listarPedidos, actualizarEstadoPedido };
