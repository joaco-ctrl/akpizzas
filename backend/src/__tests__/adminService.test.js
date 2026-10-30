jest.mock('../config/database', () => ({ query: jest.fn() }));

const conexion = require('../config/database');
const adminService = require('../service/adminService');

describe('actualizarEstadoPedido', () => {
    beforeEach(() => conexion.query.mockReset());

    test('avanza un retiro local de LISTO a ENTREGADO', done => {
        conexion.query
            .mockImplementationOnce((query, params, callback) => callback(null, [{
                estado_pedido: 'LISTO',
                metodo_entrega: 'RETIRO_LOCAL'
            }]))
            .mockImplementationOnce((query, params, callback) => callback(null, { affectedRows: 1 }));

        adminService.actualizarEstadoPedido(12, 'ENTREGADO', (error, resultado) => {
            expect(error).toBeNull();
            expect(resultado.affectedRows).toBe(1);
            expect(conexion.query.mock.calls[1][1]).toEqual(['ENTREGADO', 12, 'LISTO']);
            done();
        });
    });

    test('rechaza saltar de preparación a entregado sin ejecutar UPDATE', done => {
        conexion.query.mockImplementationOnce((query, params, callback) => callback(null, [{
            estado_pedido: 'EN_PREPARACION',
            metodo_entrega: 'DELIVERY'
        }]));

        adminService.actualizarEstadoPedido(12, 'ENTREGADO', error => {
            expect(error.status).toBe(409);
            expect(conexion.query).toHaveBeenCalledTimes(1);
            done();
        });
    });

    test('no permite marcar un pedido de retiro local EN_CAMINO', done => {
        conexion.query.mockImplementationOnce((query, params, callback) => callback(null, [{
            estado_pedido: 'LISTO',
            metodo_entrega: 'RETIRO_LOCAL'
        }]));

        adminService.actualizarEstadoPedido(12, 'EN_CAMINO', error => {
            expect(error.status).toBe(409);
            expect(conexion.query).toHaveBeenCalledTimes(1);
            done();
        });
    });
});
