const express = require('express');
const router = express.Router();

let products = [
  {
    id: 1,
    name: 'بروتين مصل اللبن',
    description: 'بروتين عالي الجودة لبناء العضلات',
    price: 150,
    category: 'protein',
    stock: 50,
    rating: 4.5
  },
  {
    id: 2,
    name: 'فيتامين D3',
    description: 'فيتامين D3 لصحة العظام والمناعة',
    price: 80,
    category: 'vitamins',
    stock: 30,
    rating: 4.8
  },
  {
    id: 3,
    name: 'زنك + ماغنيسيوم',
    description: 'مكمل معادن أساسية للصحة العامة',
    price: 120,
    category: 'minerals',
    stock: 40,
    rating: 4.3
  }
];

// Get all products
router.get('/', (req, res) => {
  res.json(products);
});

// Get product by ID
router.get('/:id', (req, res) => {
  const product = products.find(p => p.id == req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'المنتج غير موجود' });
  }
  res.json(product);
});

// Create product (Admin only)
router.post('/', (req, res) => {
  const { name, description, price, category, stock } = req.body;
  
  if (!name || !description || !price) {
    return res.status(400).json({ error: 'البيانات غير كاملة' });
  }
  
  const newProduct = {
    id: products.length + 1,
    name,
    description,
    price,
    category: category || 'other',
    stock: stock || 0,
    rating: 0
  };
  
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Update product
router.put('/:id', (req, res) => {
  const product = products.find(p => p.id == req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'المنتج غير موجود' });
  }
  
  Object.assign(product, req.body);
  res.json(product);
});

// Delete product
router.delete('/:id', (req, res) => {
  products = products.filter(p => p.id != req.params.id);
  res.json({ message: 'تم حذف المنتج' });
});

module.exports = router;
