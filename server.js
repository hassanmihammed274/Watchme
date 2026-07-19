const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const productsRouter = require('./routes/products');
const usersRouter = require('./routes/users');
const cartRouter = require('./routes/cart');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/products', productsRouter);
app.use('/api/users', usersRouter);
app.use('/api/cart', cartRouter);

// Basic Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

app.get('/api/info', (req, res) => {
  res.json({
    name: 'Watchme API',
    version: '1.0.0',
    description: 'موقع تكميلي للمكملات الغذائية',
    endpoints: {
      products: '/api/products',
      users: '/api/users',
      cart: '/api/cart'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Watchme server is running on port ${PORT}`);
  console.log(`📍 Visit: http://localhost:${PORT}`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api/info`);
});

module.exports = app;
