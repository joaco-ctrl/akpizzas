const conexion = require('../config/database');

function buscarPedidoPendiente(idUsuario, callback) {
    const query = `SELECT * FROM pedidos
        WHERE usuario_id = ? AND estado_pedido = 'PENDIENTE'
        ORDER BY id DESC LIMIT 1`;
    conexion.query(query, [idUsuario], callback);
}

function crearPedido(idUsuario, callback) {
    const query = `INSERT INTO pedidos
        (usuario_id, subtotal, total, metodo_entrega, metodo_pago)
        VALUES (?, 0, 0, 'RETIRO_LOCAL', 'EFECTIVO')`;
    conexion.query(query, [idUsuario], callback);
}

function obtenerProducto(idProducto, callback) {
    conexion.query('SELECT * FROM productos WHERE id = ? AND disponible = 1', [idProducto], callback);
}

function agregarDetalle(idPedido, idProducto, cantidad, precio, callback) {
    const query = `INSERT INTO detalle_pedido
        (pedido_id, producto_id, cantidad, precio_unitario, subtotal)
        VALUES (?, ?, ?, ?, ?)`;
    conexion.query(query, [idPedido, idProducto, cantidad, precio, precio * cantidad], callback);
}

function agregar(idUsuario, idProducto, cantidad, callback) {
    obtenerProducto(idProducto, (error, productos) => {
        if (error) return callback(error);
        if (!productos.length) return callback(Object.assign(new Error('Producto no disponible'), { status: 404 }));

        buscarPedidoPendiente(idUsuario, (searchError, pedidos) => {
            if (searchError) return callback(searchError);
            const usarPedido = pedido => agregarDetalle(pedido.id, idProducto, cantidad, Number(productos[0].precio), callback);
            if (pedidos.length) return usarPedido(pedidos[0]);

            crearPedido(idUsuario, (createError, resultado) => {
                if (createError) return callback(createError);
                usarPedido({ id: resultado.insertId });
            });
        });
    });
}

function listar(idUsuario, callback) {
    const query = `SELECT d.id, d.pedido_id, d.producto_id, p.nombre,
        d.cantidad, d.precio_unitario, d.subtotal
        FROM detalle_pedido d
        INNER JOIN pedidos pe ON pe.id = d.pedido_id
        INNER JOIN productos p ON p.id = d.producto_id
        WHERE pe.usuario_id = ? AND pe.estado_pedido = 'PENDIENTE'
        ORDER BY d.id`;
    conexion.query(query, [idUsuario], callback);
}

function modificarCantidad(idUsuario, idDetalle, cantidad, callback) {
    const findQuery = `SELECT d.id, d.pedido_id, d.precio_unitario
        FROM detalle_pedido d INNER JOIN pedidos pe ON pe.id = d.pedido_id
        WHERE d.id = ? AND pe.usuario_id = ? AND pe.estado_pedido = 'PENDIENTE'`;
    conexion.query(findQuery, [idDetalle, idUsuario], (error, detalles) => {
        if (error) return callback(error);
        if (!detalles.length) return callback(Object.assign(new Error('Detalle no encontrado'), { status: 404 }));

        const detalle = detalles[0];
        const updateQuery = `UPDATE detalle_pedido
            SET cantidad = ?, subtotal = precio_unitario * ? WHERE id = ?`;
        conexion.query(updateQuery, [cantidad, cantidad, idDetalle], updateError => {
            if (updateError) return callback(updateError);
            actualizarTotales(detalle.pedido_id, callback);
        });
    });
}

function actualizarTotales(idPedido, callback) {
    const query = `UPDATE pedidos pe
        SET subtotal = (SELECT COALESCE(SUM(d.subtotal), 0) FROM detalle_pedido d WHERE d.pedido_id = pe.id),
            total = (SELECT COALESCE(SUM(d.subtotal), 0) FROM detalle_pedido d WHERE d.pedido_id = pe.id) + pe.costo_envio
        WHERE pe.id = ?`;
    conexion.query(query, [idPedido], callback);
}

function calcularTotal(idUsuario, idPedido, callback) {
    const query = `SELECT pe.id, COALESCE(SUM(d.precio_unitario * d.cantidad), 0) AS total
        FROM pedidos pe LEFT JOIN detalle_pedido d ON d.pedido_id = pe.id
        WHERE pe.id = ? AND pe.usuario_id = ?
        GROUP BY pe.id`;
    conexion.query(query, [idPedido, idUsuario], callback);
}

module.exports = { agregar, listar, modificarCantidad, calcularTotal };