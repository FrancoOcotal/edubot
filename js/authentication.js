// Mostrar notificación en la UI
function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.className = `fixed top-4 right-4 py-2 px-4 rounded shadow-md ${
        type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"
    }`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Función para iniciar sesión
async function logIn(username, password) {
    try {
        const user = await Parse.User.logIn(username, password);
        showNotification(`¡Bienvenido, ${user.get("username") || "Usuario"}!`, "success");
        window.location.reload();
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        showNotification(`Error al iniciar sesión: ${error.message}`, "error");
    }
}

// Función para cerrar sesión
async function logOut() {
    try {
        await Parse.User.logOut();
        showNotification("¡Has cerrado sesión exitosamente!", "success");
        window.location.reload();
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        showNotification(`Error al cerrar sesión: ${error.message}`, "error");
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

// Manejo de eventos en DOM
document.addEventListener("DOMContentLoaded", () => {
    const logInForm = document.getElementById("logInForm");
    const logOutButton = document.getElementById("logOutButton");

    if (logInForm) {
        logInForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const username = logInForm.querySelector("input[name='username']").value.trim();
            const password = logInForm.querySelector("input[name='password']").value.trim();
            if (username && password) {
                logIn(username, password);
            } else {
                showNotification("Por favor, completa todos los campos.", "error");
            }
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
