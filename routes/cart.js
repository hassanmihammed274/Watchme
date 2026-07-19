const express = require('express');
const router = express.Router();

let cart = [];

// Get cart
router.get('/', (req, res) => {
  res.json(cart);
});

// Add to cart
router.post('/add', (req, res) => {
  const { productId, name, price, quantity } = req.body;
  
  if (!productId || !name || !price || !quantity) {
    return res.status(400).json({ error: 'البيانات غير كاملة' });
  }
  
  const existingItem = cart.find(item => item.productId === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ productId, name, price, quantity });
  }
  
  res.json({ message: 'تمت الإضافة للسلة', cart });
});

// Remove from cart
router.post('/remove/:productId', (req, res) => {
  cart = cart.filter(item => item.productId != req.params.productId);
  res.json({ message: 'تم الحذف من السلة', cart });
});

// Clear cart
router.post('/clear', (req, res) => {
  cart = [];
  res.json({ message: 'تم تفريغ ��لسلة' });
});

module.exports = router;
