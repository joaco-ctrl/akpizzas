jest.mock('../service/cartService', () => ({
    actualizarEntrega: jest.fn()
}));

const cartService = require('../service/cartService');
const { actualizarEntrega } = require('../controllers/cartController');

function response() {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };
}

describe('actualizarEntrega controller', () => {
    beforeEach(() => cartService.actualizarEntrega.mockReset());

    test('calcula el envío del lado del servidor y normaliza la dirección', () => {
        cartService.actualizarEntrega.mockImplementation((idUsuario, idPedido, entrega, pago, direccion, costo, callback) => {
            callback(null, { affectedRows: 1 });
        });
        const res = response();
        actualizarEntrega({
            usuario: { id: 3 },
            body: {
                idPedido: 7,
                metodoEntrega: 'DELIVERY',
                metodoPago: 'EFECTIVO',
                direccion: '  Calle 123  ',
                costoEnvio: 500000
            }
        }, res);
        expect(cartService.actualizarEntrega.mock.calls[0].slice(0, 6))
            .toEqual([3, 7, 'DELIVERY', 'EFECTIVO', 'Calle 123', 0]);
        expect(res.json).toHaveBeenCalledWith({ mensaje: 'Datos de entrega actualizados correctamente' });
    });

    test('rechaza métodos de pago que no sean efectivo', () => {
        const res = response();
        actualizarEntrega({
            usuario: { id: 3 },
            body: { idPedido: 7, metodoEntrega: 'DELIVERY', metodoPago: 'MERCADO_PAGO', direccion: 'Calle 123' }
        }, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(cartService.actualizarEntrega).not.toHaveBeenCalled();
    });

    test('rechaza direcciones que superan el límite de la base de datos', () => {
        const res = response();
        actualizarEntrega({
            usuario: { id: 3 },
            body: { idPedido: 7, metodoEntrega: 'DELIVERY', metodoPago: 'EFECTIVO', direccion: 'a'.repeat(256) }
        }, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(cartService.actualizarEntrega).not.toHaveBeenCalled();
    });
});
