jest.mock('bcrypt', () => ({
    hash: jest.fn((password, _rounds, callback) => callback(null, `hashed:${password}`))
}));

jest.mock('../service/passwordResetService', () => ({
    createPasswordResetToken: jest.fn(),
    invalidatePasswordResetToken: jest.fn(),
    resetPassword: jest.fn()
}));

jest.mock('../service/passwordResetEmailService', () => ({
    isConfigured: jest.fn(),
    sendPasswordResetEmail: jest.fn()
}));

const passwordResetService = require('../service/passwordResetService');
const passwordResetEmailService = require('../service/passwordResetEmailService');
const {
    solicitarRecuperacion,
    restablecerPassword
} = require('../controllers/passwordResetController');

function response() {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };
}

describe('password reset controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        passwordResetEmailService.isConfigured.mockReturnValue(true);
    });

    test('returns the same response when the requested email has no account', () => {
        passwordResetService.createPasswordResetToken.mockImplementation((email, callback) => {
            callback(null, null);
        });
        const res = response();

        solicitarRecuperacion({ body: { email: 'unknown@example.com' } }, res);

        expect(res.json).toHaveBeenCalledWith({
            mensaje: 'Si el correo está asociado a una cuenta activa, recibirás instrucciones para restablecer tu contraseña.'
        });
        expect(passwordResetEmailService.sendPasswordResetEmail).not.toHaveBeenCalled();
    });

    test('normalizes email and sends a reset email for an active account', async () => {
        passwordResetService.createPasswordResetToken.mockImplementation((email, callback) => {
            expect(email).toBe('person@example.com');
            callback(null, {
                email: 'person@example.com',
                token: 'a'.repeat(64),
                tokenHash: 'b'.repeat(64)
            });
        });
        passwordResetEmailService.sendPasswordResetEmail.mockResolvedValue({});
        const res = response();

        solicitarRecuperacion({ body: { email: ' Person@Example.com ' } }, res);
        await new Promise(setImmediate);

        expect(passwordResetEmailService.sendPasswordResetEmail)
            .toHaveBeenCalledWith('person@example.com', 'a'.repeat(64));
        expect(res.json).toHaveBeenCalledWith({
            mensaje: 'Si el correo está asociado a una cuenta activa, recibirás instrucciones para restablecer tu contraseña.'
        });
    });

    test('rejects invalid tokens and passwords before attempting a reset', () => {
        const res = response();

        restablecerPassword({ body: { token: 'invalid', password: 'password123' } }, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(passwordResetService.resetPassword).not.toHaveBeenCalled();
    });

    test('accepts a valid password and delegates token validation to the service', () => {
        passwordResetService.resetPassword.mockImplementation((token, passwordHash, callback) => {
            expect(token).toBe('a'.repeat(64));
            expect(passwordHash).toBe('hashed:new-password');
            callback(null, true);
        });
        const res = response();

        restablecerPassword({
            body: { token: 'a'.repeat(64), password: 'new-password' }
        }, res);

        expect(res.json).toHaveBeenCalledWith({
            mensaje: 'Contraseña restablecida correctamente. Ya podés iniciar sesión.'
        });
    });
});
