const conexion = require('../config/database');

function agregar(idUsuario, idProducto, cantidad, callback) {
    conexion.getConnection((connectionError, connection) => {
        if (connectionError) return callback(connectionError);
        let transactionStarted = false;

        const query = (sql, params = []) => new Promise((resolve, reject) => {
            connection.query(sql, params, (error, result) => error ? reject(error) : resolve(result));
        });
        const rollback = async () => {
            if (transactionStarted) {
                await new Promise(resolve => connection.rollback(rollbackError => {
                    if (rollbackError) console.error('No se pudo revertir la transacción del carrito:', rollbackError.message);
                    resolve();
                }));
            }
        };

        connection.beginTransaction(beginError => {
            if (beginError) {
                connection.release();
                return callback(beginError);
            }
            transactionStarted = true;
            const execute = async () => {
                let result;
                let operationError;
                try {
                    const users = await query('SELECT id FROM usuarios WHERE id = ? FOR UPDATE', [idUsuario]);
                    if (!users.length) throw Object.assign(new Error('Usuario no encontrado'), { status: 404 });

                    const products = await query(
                        'SELECT id, precio FROM productos WHERE id = ? AND disponible = 1 FOR UPDATE',
                        [idProducto]
                    );
                    if (!products.length) throw Object.assign(new Error('Producto no disponible'), { status: 404 });

                    const orders = await query(
                        `SELECT id FROM pedidos
                         WHERE usuario_id = ? AND estado_pedido = 'PENDIENTE'
                         ORDER BY id DESC LIMIT 1 FOR UPDATE`,
                        [idUsuario]
                    );
                    let idPedido;
                    if (orders.length) {
                        idPedido = orders[0].id;
                    } else {
                        const createdOrder = await query(
                            `INSERT INTO pedidos
                             (usuario_id, subtotal, total, metodo_entrega, metodo_pago)
                             VALUES (?, 0, 0, 'RETIRO_LOCAL', 'EFECTIVO')`,
                            [idUsuario]
                        );
                        idPedido = createdOrder.insertId;
                    }

                    const details = await query(
                        'SELECT id, cantidad FROM detalle_pedido WHERE pedido_id = ? AND producto_id = ? FOR UPDATE',
                        [idPedido, idProducto]
                    );
                    const newQuantity = (details.length ? Number(details[0].cantidad) : 0) + cantidad;
                    if (newQuantity > 99) {
                        throw Object.assign(new Error('La cantidad máxima por producto es 99'), { status: 400 });
                    }

                    let idDetalle;
                    if (details.length) {
                        idDetalle = details[0].id;
                        await query(
                            `UPDATE detalle_pedido
                             SET cantidad = ?, precio_unitario = ?, subtotal = ? WHERE id = ?`,
                            [newQuantity, Number(products[0].precio), Number(products[0].precio) * newQuantity, idDetalle]
                        );
                    } else {
                        const inserted = await query(
                            `INSERT INTO detalle_pedido
                             (pedido_id, producto_id, cantidad, precio_unitario, subtotal)
                             VALUES (?, ?, ?, ?, ?)`,
                            [idPedido, idProducto, cantidad, Number(products[0].precio), Number(products[0].precio) * cantidad]
                        );
                        idDetalle = inserted.insertId;
                    }

                    await query(
                        `UPDATE pedidos pe
                         SET subtotal = (SELECT COALESCE(SUM(d.subtotal), 0) FROM detalle_pedido d WHERE d.pedido_id = pe.id),
                             total = (SELECT COALESCE(SUM(d.subtotal), 0) FROM detalle_pedido d WHERE d.pedido_id = pe.id) + pe.costo_envio
                         WHERE pe.id = ? AND pe.estado_pedido = 'PENDIENTE'`,
                        [idPedido]
                    );
                    await new Promise((resolve, reject) => connection.commit(error => error ? reject(error) : resolve()));
                    transactionStarted = false;
                    result = { insertId: idDetalle };
                } catch (error) {
                    operationError = error;
                    await rollback();
                } finally {
                    connection.release();
                }
                callback(operationError, result);
            };
            execute();
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

function eliminar(idUsuario, idDetalle, callback) {
    const findQuery = `SELECT d.id, d.pedido_id
        FROM detalle_pedido d INNER JOIN pedidos pe ON pe.id = d.pedido_id
        WHERE d.id = ? AND pe.usuario_id = ? AND pe.estado_pedido = 'PENDIENTE'`;
    conexion.query(findQuery, [idDetalle, idUsuario], (error, detalles) => {
        if (error) return callback(error);
        if (!detalles.length) return callback(Object.assign(new Error('Detalle no encontrado'), { status: 404 }));

        conexion.query('DELETE FROM detalle_pedido WHERE id = ?', [idDetalle], deleteError => {
            if (deleteError) return callback(deleteError);
            actualizarTotales(detalles[0].pedido_id, callback);
        });
    });
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
    const query = `SELECT pe.id, pe.total
        FROM pedidos pe
        WHERE pe.id = ? AND pe.usuario_id = ?`;
    conexion.query(query, [idPedido, idUsuario], callback);
}
function listarPedidos(idUsuario, callback) {
    const query = `SELECT pe.id, pe.fecha, pe.total, pe.estado_pedido, pe.estado_pago,
        d.producto_id, d.cantidad, d.precio_unitario, p.nombre
        FROM pedidos pe
        LEFT JOIN detalle_pedido d ON d.pedido_id = pe.id
        LEFT JOIN productos p ON p.id = d.producto_id
        WHERE pe.usuario_id = ? AND pe.estado_pedido <> 'PENDIENTE'
        ORDER BY pe.fecha DESC, pe.id DESC, d.id`;
    conexion.query(query, [idUsuario], callback);
}

function actualizarEntrega(idUsuario, idPedido, metodoEntrega, metodoPago, direccion, costoEnvio, callback) {
    const query = `
        UPDATE pedidos
        SET metodo_entrega = ?,
            direccion = ?,
            costo_envio = ?,
            metodo_pago = ?,
            estado_pedido = IF(? = 'EFECTIVO', 'EN_PREPARACION', estado_pedido),
            total = subtotal + ?
        WHERE id = ? AND usuario_id = ? AND estado_pedido = 'PENDIENTE'
          AND EXISTS (SELECT 1 FROM detalle_pedido WHERE pedido_id = pedidos.id)
    `;
    conexion.query(query, [metodoEntrega, direccion, costoEnvio, metodoPago, metodoPago, costoEnvio, idPedido, idUsuario], callback);
}

module.exports = { agregar, listar, eliminar, modificarCantidad, listarPedidos, calcularTotal, actualizarEntrega };