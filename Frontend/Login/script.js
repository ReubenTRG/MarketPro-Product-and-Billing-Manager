var loginButton = document.getElementById("loginButton");
var SignupButton = document.getElementById("SignupButton")
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
