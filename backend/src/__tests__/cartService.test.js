jest.mock('../config/database', () => ({ getConnection: jest.fn(), query: jest.fn() }));

const database = require('../config/database');
const cartService = require('../service/cartService');

function createConnection({ existingOrder = true, existingQuantity = 0 } = {}) {
    const connection = {
        beginTransaction: jest.fn(callback => callback(null)),
        commit: jest.fn(callback => callback(null)),
        rollback: jest.fn(callback => callback(null)),
        release: jest.fn(),
        query: jest.fn((sql, params, callback) => {
            if (sql.includes('FROM usuarios')) return callback(null, [{ id: 3 }]);
            if (sql.includes('FROM productos')) return callback(null, [{ id: 8, precio: '10.50' }]);
            if (sql.includes('FROM pedidos')) return callback(null, existingOrder ? [{ id: 5 }] : []);
            if (sql.includes('FROM detalle_pedido')) {
                return callback(null, existingQuantity ? [{ id: 9, cantidad: existingQuantity }] : []);
            }
            if (sql.includes('INSERT INTO pedidos')) return callback(null, { insertId: 5 });
            if (sql.includes('INSERT INTO detalle_pedido')) return callback(null, { insertId: 9 });
            return callback(null, { affectedRows: 1 });
        })
    };
    return connection;
}

describe('agregar al carrito', () => {
    beforeEach(() => {
        database.getConnection.mockReset();
        database.query.mockReset();
    });

    test('usa una transacción para crear o actualizar un carrito pendiente', done => {
        const connection = createConnection({ existingOrder: false });
        database.getConnection.mockImplementation(callback => callback(null, connection));

        cartService.agregar(3, 8, 2, (error, result) => {
            expect(error).toBeUndefined();
            expect(result).toEqual({ insertId: 9 });
            expect(connection.beginTransaction).toHaveBeenCalledTimes(1);
            expect(connection.commit).toHaveBeenCalledTimes(1);
            expect(connection.rollback).not.toHaveBeenCalled();
            expect(connection.release).toHaveBeenCalledTimes(1);
            done();
        });
    });

    test('revierte la transacción si la cantidad acumulada supera 99', done => {
        const connection = createConnection({ existingOrder: true, existingQuantity: 98 });
        database.getConnection.mockImplementation(callback => callback(null, connection));

        cartService.agregar(3, 8, 2, error => {
            expect(error.status).toBe(400);
            expect(connection.rollback).toHaveBeenCalledTimes(1);
            expect(connection.commit).not.toHaveBeenCalled();
            expect(connection.release).toHaveBeenCalledTimes(1);
            done();
        });
    });

    test('moves a WhatsApp order to preparation after registration', done => {
        database.query.mockImplementation((query, params, callback) => {
            expect(query).toContain("IF(? IN ('EFECTIVO', 'WHATSAPP'), 'EN_PREPARACION', estado_pedido)");
            expect(params).toEqual(['DELIVERY', 'Calle 123', 0, 'WHATSAPP', 'WHATSAPP', 0, 7, 3]);
            callback(null, { affectedRows: 1 });
        });

        cartService.actualizarEntrega(3, 7, 'DELIVERY', 'WHATSAPP', 'Calle 123', 0, (error, result) => {
            expect(error).toBeNull();
            expect(result).toEqual({ affectedRows: 1 });
            done();
        });
    });
});
