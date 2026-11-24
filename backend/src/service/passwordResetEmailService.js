const nodemailer = require('nodemailer');

function isConfigured() {
    return Boolean(
        process.env.SMTP_USER &&
        process.env.SMTP_APP_PASSWORD &&
        process.env.FRONTEND_URL
    );
}

function sendPasswordResetEmail(email, token) {
    if (!isConfigured()) {
        return Promise.reject(new Error('SMTP_USER, SMTP_APP_PASSWORD y FRONTEND_URL deben configurarse.'));
    }

    let resetUrl;
    try {
        resetUrl = new URL('/restablecer-contrasena', process.env.FRONTEND_URL);
    } catch (error) {
        return Promise.reject(new Error('FRONTEND_URL no es una URL válida.'));
    }
    resetUrl.searchParams.set('token', token);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_APP_PASSWORD.replace(/\s/g, '')
        }
    });

    return transporter.sendMail({
        from: `AK Pizzas <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Restablecé tu contraseña de AK Pizzas',
        text: [
            'Recibimos una solicitud para restablecer la contraseña de tu cuenta de AK Pizzas.',
            'Usá este enlace dentro de los próximos 15 minutos:',
            resetUrl.toString(),
            '',
            'Si no solicitaste este cambio, podés ignorar este correo.'
        ].join('\n')
    });
}

module.exports = { isConfigured, sendPasswordResetEmail };
