const express = require('express');
const router = express.Router();

let users = [];

// Register
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'البيانات غير كاملة' });
  }
  
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'البريد الإلكتروني مستخدم بالفعل' });
  }
  
  const newUser = {
    id: users.length + 1,
    name,
    email,
    password
  };
  
  users.push(newUser);
  res.status(201).json({ message: 'تم التسجيل بنجاح', user: newUser });
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'بيانات دخول خاطئة' });
  }
  
  res.json({ message: 'تم تسجيل الدخول بنجاح', user });
});

// Get user profile
router.get('/:id', (req, res) => {
  const user = users.find(u => u.id == req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'المستخدم غير موجود' });
  }
  res.json(user);
});

module.exports = router;
