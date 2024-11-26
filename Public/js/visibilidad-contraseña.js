const togglePassword = document.getElementById("togglePassword");
const password = document.getElementById("password");

togglePassword.addEventListener("click", function () {
    const type = password.type === "password" ? "text" : "password";
    password.type = type;
    this.src = type === "password" ? "../img/login_registrarse/view.png" : "../img/login_registrarse/hide.png";
});