jest.mock('nodemailer', () => ({
    createTransport: jest.fn()
}));

const nodemailer = require('nodemailer');
const emailService = require('../service/passwordResetEmailService');

describe('password reset email service', () => {
    const originalEnv = {
        SMTP_USER: process.env.SMTP_USER,
        SMTP_APP_PASSWORD: process.env.SMTP_APP_PASSWORD,
        FRONTEND_URL: process.env.FRONTEND_URL
    };

    beforeEach(() => {
        process.env.SMTP_USER = 'akpizzas80@gmail.com';
        process.env.SMTP_APP_PASSWORD = 'test application password';
        process.env.FRONTEND_URL = 'http://localhost:5173';
        nodemailer.createTransport.mockReset();
    });

    afterAll(() => {
        for (const [key, value] of Object.entries(originalEnv)) {
            if (value === undefined) delete process.env[key];
            else process.env[key] = value;
        }
    });

    test('sends a Gmail reset link using the configured app password', async () => {
        const sendMail = jest.fn().mockResolvedValue({});
        nodemailer.createTransport.mockReturnValue({ sendMail });

        await emailService.sendPasswordResetEmail('person@example.com', 'one-time-token');

        expect(nodemailer.createTransport).toHaveBeenCalledWith({
            service: 'gmail',
            auth: {
                user: 'akpizzas80@gmail.com',
                pass: 'testapplicationpassword'
            }
        });
        const message = sendMail.mock.calls[0][0];
        expect(message.to).toBe('person@example.com');
        expect(message.text).toContain(
            'http://localhost:5173/restablecer-contrasena?token=one-time-token'
        );
    });

    test('does not report configured when the app password is missing', () => {
        delete process.env.SMTP_APP_PASSWORD;

        expect(emailService.isConfigured()).toBe(false);
    });
});
