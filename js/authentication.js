// Script para manejo de autenticación con Parse

// Función para registrar un usuario
async function signUp(username, password, email) {
    const user = new Parse.User();
    user.set("username", username);
    user.set("password", password);
    user.set("email", email);

    try {
        await user.signUp();
        alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
    } catch (error) {
        console.error("Error al registrar el usuario:", error);
        alert(`Error: ${error.message}`);
    }
}

// Función para iniciar sesión
async function logIn(username, password) {
    try {
        const user = await Parse.User.logIn(username, password);
        alert(`¡Bienvenido, ${user.get("username") || "usuario"}!`);
        window.location.reload(); // Recargar la página o redirigir
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        alert(`Error: ${error.message}`);
    }
}

// Función para cerrar sesión
async function logOut() {
    try {
        await Parse.User.logOut();
        alert("¡Has cerrado sesión exitosamente!");
        window.location.reload(); // Recargar la página o redirigir
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        alert(`Error: ${error.message}`);
    }
}

// Función para verificar si un usuario está autenticado
function getCurrentUser() {
    const currentUser = Parse.User.current();
    if (currentUser) {
        console.log(`Usuario autenticado: ${currentUser.get("username")}`);
        return currentUser;
    } else {
        console.log("No hay usuario autenticado.");
        return null;
    }
}

// Eventos para los formularios de registro, inicio de sesión y cierre de sesión
document.addEventListener("DOMContentLoaded", () => {
    const signUpForm = document.getElementById("signUpForm");
    const logInForm = document.getElementById("logInForm");
    const logOutButton = document.getElementById("logOutButton");

    if (signUpForm) {
        signUpForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const username = signUpForm.querySelector("input[name='username']").value;
            const password = signUpForm.querySelector("input[name='password']").value;
            const email = signUpForm.querySelector("input[name='email']").value;
            signUp(username, password, email);
        });
    }

    if (logInForm) {
        logInForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const username = logInForm.querySelector("input[name='username']").value;
            const password = logInForm.querySelector("input[name='password']").value;
            logIn(username, password);
        });
    }

    if (logOutButton) {
        logOutButton.addEventListener("click", (event) => {
            event.preventDefault();
            logOut();
        });
    }

    // Verificar el usuario actual al cargar la página
    getCurrentUser();
});
