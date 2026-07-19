// Main JavaScript file for Watchme

// Fetch products from API
async function loadProducts() {
    try {
        const response = await fetch('http://localhost:5000/api/products');
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Display products on the page
function displayProducts(products) {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    container.innerHTML = '';
    products.forEach(product => {
        const productCard = `
            <div class="col-md-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="text-primary fw-bold">السعر: ${product.price} ريال</p>
                        <button class="btn btn-primary w-100" onclick="addToCart('${product.id}')">أضف للسلة</button>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += productCard;
    });
}

// Add product to cart
function addToCart(productId) {
    console.log('Product added to cart:', productId);
    alert('تم إضافة المنتج إلى السلة!');
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});
