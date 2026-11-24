jest.mock('../config/database', () => ({
    query: jest.fn(),
    getConnection: jest.fn()
}));

const crypto = require('crypto');
const database = require('../config/database');
const passwordResetService = require('../service/passwordResetService');

describe('password reset service', () => {
    beforeEach(() => {
        database.query.mockReset();
        database.getConnection.mockReset();
    });

    test('stores only a hash of the generated reset token', done => {
        database.query.mockImplementation((sql, params, callback) => {
            if (typeof params === 'function') {
                callback = params;
                params = [];
            }
            if (sql.includes('SELECT id, email FROM usuarios')) {
                return callback(null, [{ id: 8, email: 'person@example.com' }]);
            }
            if (sql.includes('DELETE FROM password_reset_tokens')) {
                return callback(null, { affectedRows: 0 });
            }
            if (sql.includes('INSERT INTO password_reset_tokens')) {
                expect(params[0]).toBe(8);
                expect(params[1]).toMatch(/^[a-f0-9]{64}$/);
                return callback(null, { insertId: 1 });
            }
            throw new Error(`Unexpected query: ${sql}`);
        });

        passwordResetService.createPasswordResetToken('person@example.com', (error, reset) => {
            expect(error).toBeNull();
            expect(reset.email).toBe('person@example.com');
            expect(reset.token).toMatch(/^[a-f0-9]{64}$/);
            expect(reset.tokenHash).toBe(
                crypto.createHash('sha256').update(reset.token).digest('hex')
            );
            done();
        });
    });

    test('accepts a reset token once and updates the password transactionally', done => {
        const token = 'a'.repeat(64);
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const connection = {
            beginTransaction: jest.fn(callback => callback(null)),
            commit: jest.fn(callback => callback(null)),
            rollback: jest.fn(callback => callback(null)),
            release: jest.fn(),
            query: jest.fn((sql, params, callback) => {
                if (sql.includes('SELECT user_id FROM password_reset_tokens')) {
                    expect(params).toEqual([tokenHash]);
                    return callback(null, [{ user_id: 8 }]);
                }
                if (sql.includes('UPDATE usuarios SET password')) {
                    expect(params).toEqual(['hashed-password', 8]);
                    return callback(null, { affectedRows: 1 });
                }
                if (sql.includes('UPDATE password_reset_tokens SET used_at')) {
                    expect(params).toEqual([8]);
                    return callback(null, { affectedRows: 1 });
                }
                throw new Error(`Unexpected query: ${sql}`);
            })
        };
        database.getConnection.mockImplementation(callback => callback(null, connection));

        passwordResetService.resetPassword(token, 'hashed-password', (error, reset) => {
            expect(error).toBeNull();
            expect(reset).toBe(true);
            expect(connection.commit).toHaveBeenCalledTimes(1);
            expect(connection.rollback).not.toHaveBeenCalled();
            expect(connection.release).toHaveBeenCalledTimes(1);
            done();
        });
    });

    test('rejects expired or already used tokens without changing password', done => {
        const connection = {
            beginTransaction: jest.fn(callback => callback(null)),
            commit: jest.fn(),
            rollback: jest.fn(callback => callback(null)),
            release: jest.fn(),
            query: jest.fn((sql, _params, callback) => {
                if (sql.includes('SELECT user_id FROM password_reset_tokens')) {
                    return callback(null, []);
                }
                throw new Error(`Unexpected query: ${sql}`);
            })
        };
        database.getConnection.mockImplementation(callback => callback(null, connection));

        passwordResetService.resetPassword('a'.repeat(64), 'hashed-password', (error, reset) => {
            expect(error).toBeNull();
            expect(reset).toBe(false);
            expect(connection.rollback).toHaveBeenCalledTimes(1);
            expect(connection.commit).not.toHaveBeenCalled();
            expect(connection.release).toHaveBeenCalledTimes(1);
            done();
        });
    });
});
