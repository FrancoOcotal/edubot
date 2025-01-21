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

// Eventos para los formularios de inicio de sesión y cierre de sesión
document.addEventListener("DOMContentLoaded", () => {
    const logInForm = document.getElementById("logInForm");
    const logOutButton = document.getElementById("logOutButton");

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
