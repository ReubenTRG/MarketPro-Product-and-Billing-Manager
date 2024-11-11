const products = [
    // Dairy Products
    { id: 'P001', name: 'Milk', price: 70, category: 'Dairy', image: 'images/milk.jpg' },
    { id: 'P002', name: 'Cheese', price: 130, category: 'Dairy', image: 'images/cheese.jpg' },
    { id: 'P003', name: 'Butter', price: 60, category: 'Dairy', image: 'images/butter.jpg' },
    { id: 'P004', name: 'Yogurt', price: 40, category: 'Dairy', image: 'images/yogurt.jpg' },
    { id: 'P005', name: 'Lassi', price: 40, category: 'Dairy', image: 'images/Lassi.jpg' },
    { id: 'P006', name: 'Paneer', price: 80, category: 'Dairy', image: 'images/paneer.jpg' },

    // Fruits and Vegetables
    { id: 'P007', name: 'Apple', price: 190, category: 'Fruits and Vegetables', image: 'images/apple.jpg' },
    { id: 'P008', name: 'Carrot', price:80, category: 'Fruits and Vegetables', image: 'images/carrot.jpg' },
    { id: 'P009', name: 'Orange', price: 80, category: 'Fruits and Vegetables', image: 'images/orange.jpg' },
    { id: 'P010', name: 'Spinach', price: 20, category: 'Fruits and Vegetables', image: 'images/spinach.jpg' },
    { id: 'P011', name: 'Tomato', price: 80, category: 'Fruits and Vegetables', image: 'images/tomato.jpg' },
    { id: 'P012', name: 'Grapes', price: 100, category: 'Fruits and Vegetables', image: 'images/grapes.jpg' },

    // Stationary
    { id: 'P013', name: 'Notebook', price: 60, category: 'Stationary', image: 'images/notebook.jpg' },
    { id: 'P014', name: 'Pen', price: 10, category: 'Stationary', image: 'images/pen.jpg' },
    { id: 'P015', name: 'Pencil', price: 5, category: 'Stationary', image: 'images/pencil.jpg' },
    { id: 'P016', name: 'Eraser', price: 5, category: 'Stationary', image: 'images/eraser.jpg' },
    { id: 'P017', name: 'Marker', price: 20, category: 'Stationary', image: 'images/marker.jpg' },
    { id: 'P018', name: 'Ruler', price: 5, category: 'Stationary', image: 'images/ruler.jpg' },

    // Personal Care
    { id: 'P019', name: 'Shampoo', price: 200, category: 'Personal Care', image: 'images/shampoo.jpg' },
    { id: 'P020', name: 'Toothpaste', price: 40, category: 'Personal Care', image: 'images/toothpaste.jpg' },
    { id: 'P021', name: 'Soap', price: 30, category: 'Personal Care', image: 'images/soap.jpg' },
    { id: 'P022', name: 'Toothbrush', price: 15, category: 'Personal Care', image: 'images/toothbrush.jpg' },
    { id: 'P023', name: 'Shaving Cream', price: 150, category: 'Personal Care', image: 'images/shaving_cream.jpg' },
    { id: 'P024', name: 'Body Lotion', price: 350, category: 'Personal Care', image: 'images/body_lotion.jpg' },

    // Food
    { id: 'P025', name: 'Rice', price: 85, category: 'Food', image: 'images/rice.jpg' },
    { id: 'P026', name: 'Pasta', price: 25, category: 'Food', image: 'images/pasta.jpg' },
    { id: 'P027', name: 'Cereal', price: 330, category: 'Food', image: 'images/cereal.jpg' },
    { id: 'P028', name: 'Noodles', price: 40, category: 'Food', image: 'images/noodles.jpg' },
    { id: 'P029', name: 'Sugar', price: 55, category: 'Food', image: 'images/sugar.jpg' },
    { id: 'P030', name: 'Flour', price: 50, category: 'Food', image: 'images/flour.jpg' }
];



function displayProducts(filteredProducts = products) {
    const categories = {
        'Dairy': document.getElementById('dairyProducts'),
        'Fruits and Vegetables': document.getElementById('fruitProducts'),
        'Stationary': document.getElementById('stationaryProducts'),
        'Personal Care': document.getElementById('personalCareProducts'),
        'Food': document.getElementById('foodProducts')
    };

    for (let category in categories) {
        categories[category].innerHTML = '';
    }

    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.image}">
            <h3>${product.name}</h3>
            <p>₹${product.price.toFixed(2)}</p>
            <button onclick="addToCart('${product.id}')">Add to Cart</button>
        `;
        const categorySection = categories[product.category];
        if (categorySection) {
            categorySection.appendChild(productCard);
        }
    });
}

function filterProducts() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchInput));
    displayProducts(filteredProducts);
}


const cart = [];

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        updateCart();
    }
}

function updateCart() {
    const cartItemsContainer = document.querySelector('.cart-items');
    cartItemsContainer.innerHTML = '';

    let total = 0;
    cart.forEach((item,index) => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
        
            <span class="cart-item-name">${item.name}</span>
            <span class="cart-item-price">₹${item.price.toFixed(2)}</span>
        
            <button onclick="removeFromCart(${index})" class="remove_button">Remove</button>
        

        `;
        cartItemsContainer.appendChild(cartItem);
        total += item.price;
    });

    document.getElementById('cartTotalAmount').innerText = `₹${total.toFixed(2)}`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function toggleCart() {
    const cartSection = document.getElementById('cartSection');
    cartSection.style.display = (cartSection.style.display === 'block') ? 'none' : 'block';
}


function openCheckoutPopup() {
    const totalAmount = document.getElementById('cartTotalAmount').innerText;
    document.getElementById("totalAmount").textContent = totalAmount;
    document.getElementById("checkoutModal").style.display = "flex"; 
}


function confirmOrder() {
    const streetAddress = document.getElementById("streetAddress").value.trim();
    const city = document.getElementById("city").value.trim();
    const pincode = document.getElementById("pincode").value.trim();
    const district = document.getElementById("district").value.trim();
    

    if (!streetAddress || !city || !pincode || !district) {
        alert("Please fill out all address fields.");
        return;
    }

    // Show confirmation message
    document.getElementById("confirmationMessage").textContent = "Order Confirmed! Thank you for shopping.";

    // Clear cart and close the modal after a delay
    setTimeout(() => {
        cart.length = 0;
        updateCart();
        closeCheckoutPopup();
    }, 2000);
}

// Close the checkout popup
function closeCheckoutPopup() {
    document.getElementById("checkoutModal").style.display = "none";
    document.getElementById("confirmationMessage").textContent = '';  // Clear any previous confirmation message
}

document.addEventListener('DOMContentLoaded', () => displayProducts());

document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form from refreshing the page

    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (email && message) {
        // Simulate sending the message
        setTimeout(() => {
            document.getElementById('contactFormResponse').textContent = "Your message has been sent. We'll get back to you soon!";
            document.getElementById('contactForm').reset(); // Reset form fields
        }, 500);
    } else {
        document.getElementById('contactFormResponse').textContent = "Please fill in both fields.";
    }
});

