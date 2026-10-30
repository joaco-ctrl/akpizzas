jest.mock('../service/adminService', () => ({
    actualizarEstadoPedido: jest.fn()
}));

const adminService = require('../service/adminService');
const { actualizarEstadoPedido } = require('../controllers/adminController');

function response() {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };
}

describe('actualizarEstadoPedido controller', () => {
    beforeEach(() => adminService.actualizarEstadoPedido.mockReset());

    test('rechaza IDs de pedido inválidos', () => {
        const res = response();
        actualizarEstadoPedido({ params: { id: '0' }, body: { estado: 'LISTO' } }, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(adminService.actualizarEstadoPedido).not.toHaveBeenCalled();
    });

    test('devuelve conflicto cuando la transición no es válida', () => {
        adminService.actualizarEstadoPedido.mockImplementation((id, estado, callback) => {
            const error = new Error('Transición no permitida');
            error.status = 409;
            callback(error);
        });
        const res = response();
        actualizarEstadoPedido({ params: { id: '4' }, body: { estado: 'ENTREGADO' } }, res);
        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({ error: 'Transición no permitida' });
    });
});
