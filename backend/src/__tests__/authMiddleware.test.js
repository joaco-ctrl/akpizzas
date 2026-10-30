jest.mock('../service/authService', () => ({
    obtenerPerfil: jest.fn()
}));

const jwt = require('jsonwebtoken');
const authService = require('../service/authService');
const { verificarToken, verificarAdmin } = require('../middlewares/auth');

function response() {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };
}

describe('auth middleware', () => {
    beforeEach(() => {
        process.env.JWT_SECRET = 'test-secret-for-auth-middleware';
        authService.obtenerPerfil.mockReset();
    });

    test('rechaza tokens de usuarios desactivados', () => {
        const req = { headers: { authorization: `Bearer ${jwt.sign({ id: 2, rol: 'admin' }, process.env.JWT_SECRET)}` } };
        const res = response();
        authService.obtenerPerfil.mockImplementation((id, callback) => callback(null, []));

        verificarToken(req, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(401);
        expect(authService.obtenerPerfil).toHaveBeenCalledWith(2, expect.any(Function));
    });

    test('usa el rol vigente de la base de datos, no el del token', () => {
        const req = { headers: { authorization: `Bearer ${jwt.sign({ id: 2, rol: 'admin' }, process.env.JWT_SECRET)}` } };
        const res = response();
        const next = jest.fn();
        const authNext = jest.fn();
        authService.obtenerPerfil.mockImplementation((id, callback) => callback(null, [{ id, rol: 'user' }]));

        verificarToken(req, res, authNext);
        verificarAdmin(req, res, next);

        expect(req.usuario.rol).toBe('user');
        expect(authNext).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });
});
