const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET debe configurarse antes de iniciar el backend');
}
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const database = require('./config/database');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '32kb' }));

app.get('/health', (req, res) => {
  database.query('SELECT 1', error => {
    if (error) return res.status(503).json({ status: 'unavailable' });
    res.json({ status: 'ok' });
  });
});

app.use('/auth', authRoutes);
app.use('/cart', cartRoutes);
app.use('/product', productRoutes);
app.use('/payment', paymentRoutes);
app.use('/admin', adminRoutes);

app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  const status = error.type === 'entity.too.large'
    ? 413
    : error.type === 'entity.parse.failed' ? 400 : 500;
  const message = status === 413
    ? 'El contenido enviado es demasiado grande.'
    : status === 400 ? 'El JSON enviado no es válido.' : 'Ocurrió un error interno.';
  if (status === 500) console.error('Error no controlado en la solicitud:', error);
  res.status(status).json({ error: message });
});

if (require.main === module) {
  const port = Number(process.env.PORT || 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT debe ser un puerto válido');
  }
  app.listen(port, () => console.log(`Server is running on port ${port}`));
}

module.exports = app;
