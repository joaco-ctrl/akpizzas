const paymentService = require('../service/paymentService');

function crearPreferencia(req, res) {
    if (!paymentService.estaHabilitado()) {
        return res.status(503).json({ error: 'Los pagos en línea están deshabilitados' });
    }
    const idPedido = Number(req.body.idPedido);
    if (!Number.isInteger(idPedido) || idPedido < 1) {
        return res.status(400).json({ error: 'idPedido debe ser un entero válido' });
    }

    paymentService.crearPreferencia(req.usuario.id, idPedido, (error, preferencia) => {
        if (error) return res.status(error.status || 500).json({ error: error.status ? error.message : 'Error al crear el pago' });
        res.status(201).json(preferencia);
    });
}

function recibirWebhook(req, res) {
    if (!paymentService.estaHabilitado()) {
        return res.status(503).json({ error: 'Los pagos en línea están deshabilitados' });
    }
    paymentService.procesarWebhook({ ...req.query, ...req.body }, error => {
        if (error) return res.status(500).json({ error: 'Error al procesar la notificación de pago' });
        res.sendStatus(200);
    });
}

module.exports = { crearPreferencia, recibirWebhook };