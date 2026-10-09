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

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/cart', cartRoutes);
app.use('/product', productRoutes);
app.use('/payment', paymentRoutes);
app.use('/admin', adminRoutes);


app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
