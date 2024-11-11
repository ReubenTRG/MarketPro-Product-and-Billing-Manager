function toggleInventorySection() {
    const inventorySection = document.getElementById('viewInventory');

    if (inventorySection.style.display === 'block') {
        inventorySection.style.display = 'none'; 
    } else {
        inventorySection.style.display = 'block'; 
        inventorySection.scrollIntoView({ behavior: 'smooth' }); 
    }
}


function toggleLowStockSection() {
    const lowStockSection = document.getElementById('lowStockSection');

    if (lowStockSection.style.display === 'block') {
        lowStockSection.style.display = 'none';
    } else {
        lowStockSection.style.display = 'block';
        populateLowStockTable(); 
        lowStockSection.scrollIntoView({ behavior: 'smooth' });
    }
}



document.querySelector('.section-card[href="#view-inventory"]').onclick = toggleInventorySection;
function openPopup(popupId) {
    document.getElementById(popupId).style.display = 'flex';
}
function closePopup(popupId) {
    document.getElementById(popupId).style.display = 'none';
}

window.onclick = function (event) {
    const popups = document.querySelectorAll(".popup"); 
    popups.forEach(popup => {
        if (event.target === popup) {
            popup.style.display = "none";
        }
    });
};

const inventory = [
    { productID: 'P001', name: 'Milk', category: 'Dairy', quantity: 50, price: 1.2 },
    { productID: 'P002', name: 'Bread', category: 'Bakery', quantity: 0, price: 0.8 },
    { productID: 'P003', name: 'Eggs', category: 'Poultry', quantity: 100, price: 0.2 },
];

function populateInventoryTable() {
    const tableBody = document.getElementById('inventoryTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; 

    inventory.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.productID}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.quantity}</td>
            <td>$${product.price.toFixed(2)}</td>
        `;
        tableBody.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', populateInventoryTable);

function filterInventory() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const tableRows = document.getElementById('inventoryTable').getElementsByTagName('tbody')[0].getElementsByTagName('tr');

    Array.from(tableRows).forEach(row => {
        const productName = row.getElementsByTagName('td')[1].textContent.toLowerCase();
        if (productName.includes(searchInput)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function populateLowStockTable() {
    const lowStockTable = document.getElementById('lowStockTable');
    lowStockTable.innerHTML = '';
    inventory
        .filter(item => item.quantity ==0) 
        .forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.productID}</td>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
            `;
            lowStockTable.appendChild(row);
        });
}
