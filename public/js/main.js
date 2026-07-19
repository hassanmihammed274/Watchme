// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
  loadProducts();
  updateCartBadge();
  checkUserLogin();
});

const API_URL = 'http://localhost:5000/api';

// Load products from API
async function loadProducts() {
  try {
    const response = await fetch(`${API_URL}/products`);
    const products = await response.json();
    displayProducts(products);
  } catch (error) {
    console.error('خطأ في تحميل المنتجات:', error);
  }
}

// Display products on page
function displayProducts(products) {
  const container = document.getElementById('products-container');
  if (!container) return;

  container.innerHTML = products.map(product => `
    <div class="col-md-4 col-sm-6">
      <div class="card h-100">
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">${product.description}</p>
          <div class="mb-2">
            <span class="badge bg-info">${product.category}</span>
            <span class="float-end">⭐ ${product.rating}</span>
          </div>
          <p class="text-primary fw-bold">السعر: ${product.price} ريال</p>
          <p class="text-muted small">المخزون: ${product.stock}</p>
          <button class="btn btn-primary w-100" onclick="addToCart(${product.id}, '${product.name}', ${product.price})">
            🛒 أضف للسلة
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// Add to cart
async function addToCart(productId, name, price) {
  try {
    const response = await fetch(`${API_URL}/cart/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId,
        name,
        price,
        quantity: 1
      })
    });
    const data = await response.json();
    saveCartToLocalStorage(data.cart);
    updateCartBadge();
    showNotification(`تم إضافة ${name} للسلة ✓`);
  } catch (error) {
    console.error('خطأ:', error);
  }
}

// Save cart to local storage
function saveCartToLocalStorage(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Get cart from local storage
function getCartFromLocalStorage() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

// Update cart badge
function updateCartBadge() {
  const cart = getCartFromLocalStorage();
  const badge = document.querySelector('.cart-badge');
  if (badge) {
    badge.textContent = cart.length;
  }
}

// Display cart items
function displayCartItems() {
  const cart = getCartFromLocalStorage();
  const container = document.getElementById('cart-items');
  
  if (!container) return;
  
  if (cart.length === 0) {
    container.innerHTML = '<p class="alert alert-info">السلة فارغة</p>';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="card mb-3">
      <div class="card-body">
        <div class="row align-items-center">
          <div class="col-md-6">
            <h6>${item.name}</h6>
            <p class="text-muted mb-0">السعر: ${item.price} ريال</p>
          </div>
          <div class="col-md-3">
            <input type="number" min="1" value="${item.quantity}" 
              onchange="updateQuantity(${item.productId}, this.value)" class="form-control">
          </div>
          <div class="col-md-3 text-end">
            <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.productId})">
              حذف
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  updateTotal();
}

// Update quantity
function updateQuantity(productId, quantity) {
  const cart = getCartFromLocalStorage();
  const item = cart.find(i => i.productId === productId);
  if (item) {
    item.quantity = parseInt(quantity);
    saveCartToLocalStorage(cart);
    displayCartItems();
  }
}

// Remove from cart
async function removeFromCart(productId) {
  try {
    const response = await fetch(`${API_URL}/cart/remove/${productId}`, {
      method: 'POST'
    });
    const data = await response.json();
    saveCartToLocalStorage(data.cart);
    displayCartItems();
    showNotification('تم الحذف من السلة ✓');
  } catch (error) {
    console.error('خطأ:', error);
  }
}

// Update total price
function updateTotal() {
  const cart = getCartFromLocalStorage();
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalElement = document.getElementById('total');
  if (totalElement) {
    totalElement.textContent = `${total} ريال`;
  }
}

// Register user
async function registerUser(event) {
  event.preventDefault();
  
  const name = document.getElementById('name')?.value;
  const email = document.getElementById('email')?.value;
  const password = document.getElementById('password')?.value;
  const confirmPassword = document.getElementById('confirmPassword')?.value;

  if (!name || !email || !password) {
    showNotification('الرجاء ملء جميع الحقول', 'error');
    return;
  }

  if (password !== confirmPassword) {
    showNotification('كلمات المرور غير متطابقة', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('user', JSON.stringify(data.user));
      showNotification('تم التسجيل بنجاح ✓');
      setTimeout(() => window.location.href = '/', 2000);
    } else {
      showNotification(data.error, 'error');
    }
  } catch (error) {
    showNotification('خطأ في التسجيل', 'error');
    console.error('خطأ:', error);
  }
}

// Login user
async function loginUser(event) {
  event.preventDefault();
  
  const email = document.getElementById('email')?.value;
  const password = document.getElementById('password')?.value;

  if (!email || !password) {
    showNotification('الرجاء ملء جميع الحقول', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('user', JSON.stringify(data.user));
      showNotification('تم تسجيل الدخول بنجاح ✓');
      setTimeout(() => window.location.href = '/', 2000);
    } else {
      showNotification(data.error, 'error');
    }
  } catch (error) {
    showNotification('خطأ في تسجيل الدخول', 'error');
    console.error('خطأ:', error);
  }
}

// Checkout
async function checkout() {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user) {
    showNotification('الرجاء تسجيل الدخول أولاً', 'error');
    window.location.href = '/pages/login.html';
    return;
  }

  const cart = getCartFromLocalStorage();
  if (cart.length === 0) {
    showNotification('السلة فارغة', 'error');
    return;
  }

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  showNotification('جاري معالجة الطلب...');
  
  setTimeout(() => {
    showNotification('تم استقبال الطلب بنجاح! سيتم توصيله قريباً ✓');
    localStorage.removeItem('cart');
    updateCartBadge();
    displayCartItems();
  }, 2000);
}

// Show notification
function showNotification(message, type = 'success') {
  const alertClass = type === 'error' ? 'alert-danger' : 'alert-success';
  const alertHTML = `
    <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;
  
  const container = document.querySelector('.container') || document.body;
  const alertElement = document.createElement('div');
  alertElement.innerHTML = alertHTML;
  container.insertBefore(alertElement.firstChild, container.firstChild);

  setTimeout(() => {
    alertElement.firstChild?.remove();
  }, 5000);
}

// Check if user is logged in
function checkUserLogin() {
  const user = JSON.parse(localStorage.getItem('user'));
  const loginLink = document.getElementById('login-link');
  const profileLink = document.getElementById('profile-link');
  const logoutLink = document.getElementById('logout-link');

  if (user) {
    if (loginLink) loginLink.style.display = 'none';
    if (profileLink) {
      profileLink.style.display = 'inline';
      profileLink.textContent = `👤 ${user.name}`;
    }
    if (logoutLink) logoutLink.style.display = 'inline';
  } else {
    if (loginLink) loginLink.style.display = 'inline';
    if (profileLink) profileLink.style.display = 'none';
    if (logoutLink) logoutLink.style.display = 'none';
  }
}

// Logout
function logout() {
  localStorage.removeItem('user');
  localStorage.removeItem('cart');
  showNotification('تم تسجيل الخروج بنجاح');
  setTimeout(() => window.location.href = '/', 1500);
}
