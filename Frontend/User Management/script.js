function toggleUsersSection() {
    const usersSection = document.getElementById('viewUsers');

    if (usersSection.style.display === 'block') {
        usersSection.style.display = 'none'; // Hide section if visible
    } else {
        usersSection.style.display = 'block'; // Show section if hidden
        usersSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Call this function when the "View Inventory" button is clicked
document.querySelector('.section-card[href="#viewUsers"]').onclick = toggleUsersSection;

// Function to open the popup
function openPopup(popupId) {
    document.getElementById(popupId).style.display = 'flex';
}

// Function to close the popup
function closePopup(popupId) {
    document.getElementById(popupId).style.display = 'none';
}

// Close popup when clicking outside of it
window.onclick = function (event) {
    const popups = document.querySelectorAll(".popup"); // Selects all popups
    popups.forEach(popup => {
        if (event.target === popup) {
            popup.style.display = "none";
        }
    });
};

// Users array
const users = [
    { userID: 'U001', name: 'Savio', role: 'Admin' },
    { userID: 'U002', name: 'Reuben', role: 'Inventory Manager' },
    { userID: 'U003', name: 'Thomas', role: 'Customer' }
];

// Populate the users table
function populateUsersTable() {
    const tableBody = document.getElementById('userTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.userID}</td>
            <td>${user.name}</td>
            <td>${user.role}</td>
        `;
        tableBody.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', populateUsersTable);

// Filter users in the table based on search input
function filterUsers() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const tableRows = document.getElementById('userTable').getElementsByTagName('tbody')[0].getElementsByTagName('tr');

    Array.from(tableRows).forEach(row => {
        const userName = row.getElementsByTagName('td')[1].textContent.toLowerCase();
        if (userName.includes(searchInput)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}
