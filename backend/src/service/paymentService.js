const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const conexion = require('../config/database');

function estaHabilitado() {
  return process.env.MP_ENABLED === 'true' && Boolean(process.env.MP_ACCESS_TOKEN);
}

const client = estaHabilitado()
  ? new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN })
  : null;

// 1. Crear preferencia de pago
function crearPreferencia(idUsuario, idPedido, callback) {
  if (!client) return callback(Object.assign(new Error('Los pagos en línea no están configurados'), { status: 503 }));
  // Consultar el pedido y sus detalles verificando que pertenezca al usuario
  const query = `
    SELECT pe.id AS pedido_id, pe.costo_envio, d.cantidad, d.precio_unitario, p.nombre
    FROM pedidos pe
    INNER JOIN detalle_pedido d ON d.pedido_id = pe.id
    INNER JOIN productos p ON p.id = d.producto_id
    WHERE pe.id = ? AND pe.usuario_id = ? AND pe.estado_pedido = 'PENDIENTE'
  `;

  conexion.query(query, [idPedido, idUsuario], (error, filas) => {
    if (error) return callback(error);
    if (!filas.length) {
      return callback(Object.assign(new Error('Pedido no encontrado o sin productos'), { status: 404 }));
    }

    // Mapear los items obtenidos directamente de la BD
    const items = filas.map(item => ({
      title: item.nombre,
      quantity: Number(item.cantidad),
      unit_price: Number(item.precio_unitario),
      currency_id: 'ARS',
    }));

    // Si tiene costo de envío, agregarlo como un item adicional
    if (Number(filas[0].costo_envio) > 0) {
      items.push({
        title: 'Costo de envío',
        quantity: 1,
        unit_price: Number(filas[0].costo_envio),
        currency_id: 'ARS',
      });
    }

    const preference = new Preference(client);
    preference.create({
      body: {
        items,
        external_reference: String(idPedido), // ID de pedido en tu MySQL
        back_urls: {
          success: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/pedido-confirmado?status=success`,
          failure: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout?status=failure`,
          pending: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/pedido-confirmado?status=pending`,
        },
        auto_return: 'approved',
        notification_url: `${process.env.BACKEND_URL}/payment/webhook`,
      },
    })
    .then(result => callback(null, { preferenceId: result.id, init_point: result.init_point }))
    .catch(err => callback(err));
  });
}

// 2. Procesar Webhook cuando Mercado Pago notifica un evento
function procesarWebhook(query, callback) {
  if (!client) return callback(Object.assign(new Error('Los pagos en línea no están configurados'), { status: 503 }));
  const topic = query.topic || query.type || query.action?.split('.')[0];

  if (topic === 'payment') {
    const paymentId = query['data.id'] || query.data?.id || query.id;
    if (!paymentId) return callback(null);
    const payment = new Payment(client);

    payment.get({ id: paymentId })
      .then(paymentData => {
        const idPedido = Number(paymentData.external_reference);
        const estadoPago = paymentData.status;

        if (estadoPago === 'approved') {
          const updateQuery = `
            UPDATE pedidos 
            SET estado_pago = 'APROBADO', 
                estado_pedido = 'EN_PREPARACION', 
                metodo_pago = 'MERCADO_PAGO',
                mercado_pago_id = ? 
            WHERE id = ?
          `;
          conexion.query(updateQuery, [String(paymentId), idPedido], callback);
        } else if (estadoPago === 'rejected') {
          const updateQuery = `UPDATE pedidos SET estado_pago = 'RECHAZADO' WHERE id = ?`;
          conexion.query(updateQuery, [idPedido], callback);
        } else {
          callback(null);
        }
      })
      .catch(err => callback(err));
  } else {
    callback(null);
  }
}

module.exports = { crearPreferencia, procesarWebhook, estaHabilitado };