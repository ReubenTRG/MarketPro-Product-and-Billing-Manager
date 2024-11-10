var loginButton = document.getElementById("loginButton");
var SignupButton = document.getElementById("SignupButton")
var SignupForm = document.getElementById("SignupForm");
var buttonContainer = document.getElementById("buttonContainer");
var loginForm = document.getElementById("loginForm");
var closeForm = document.getElementById("closeForm");
var closeFormSignup = document.getElementById("closeFormSignup");
loginButton.onclick = function () {
    buttonContainer.classList.add("hidden"); 
    loginForm.classList.remove("hidden");
}

SignupButton.onclick = function () {
    buttonContainer.classList.add("hidden"); 
    SignupForm.classList.remove("hidden"); 
}

closeForm.onclick = function () {
    loginForm.classList.add("hidden");
    buttonContainer.classList.remove("hidden"); 
}
closeFormSignup.onclick = function () {
    SignupForm.classList.add("hidden");
    buttonContainer.classList.remove("hidden"); 
}

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent page reload

    // Collect data from the login form
    const username = document.getElementById("username").value;
    const password = document.getElementById("loginPassword").value;

    // Send login request to backend API
    try {
        const response = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: username, password })
        });

        const result = await response.json();
        if (result.success) {
            if (result.role === "admin") {
                alert("Login successful! Redirecting to admin dashboard...");
                window.location.href = "../Admin/home.html";
            } else if (result.role === "customer") {
                alert("Login successful! Redirecting to customer dashboard...");
                window.location.href = "customer_dashboard.html";
            } else if (result.role === "inventory_manager") {
                alert("Login successful! Redirecting to customer dashboard...");
                window.location.href = "customer_dashboard.html";
            }
        } else {
            alert("Login failed: " + result.message);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while logging in.");
    }
});

// Handle signup form submission
SignupForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent page reload

    // Collect data from the signup form
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Send signup request to backend API
    try {
        const response = await fetch("/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: email, password })
        });

        const result = await response.json();
        if (result.success) {
            alert("Signup successful");
            window.location.href = "/.html"; // TODO: direct to customer page
        } else {
            alert("Signup failed: " + result.message);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while signing up.");
    }
});