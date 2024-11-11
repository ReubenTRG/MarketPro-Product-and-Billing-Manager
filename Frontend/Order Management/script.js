const orders = [
    {
        order_id: 'O001',
        user_id: 'U001',
        total: 2500,
        products: [
            { product_id: 'P001', quantity: 1 },
            { product_id: 'P002', quantity: 2 }
        ]
    },
    {
        order_id: 'O002',
        user_id: 'U002',
        total: 1500,
        products: [
            { product_id: 'P003', quantity: 1 }
        ]
    }
];

function populateOrdersTable() {
    const tableBody = document.getElementById('ordersTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    orders.forEach(order => {
        
        const row = document.createElement('tr');

        
        const productsString = order.products.map(product => `${product.product_id} (x${product.quantity})`).join(', ');

        
        row.innerHTML = `
            <td>${order.order_id}</td>
            <td>${order.user_id}</td>
            <td>${order.total}</td>
            <td>${productsString}</td> <!-- Combined product details in one cell -->
        `;
        tableBody.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', populateOrdersTable);
