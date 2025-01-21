// Archivo: js/helpers.js
// Función reutilizable para mostrar mensajes de notificación
function showNotification(message, type = "success") {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.className = `fixed top-4 right-4 py-2 px-4 rounded shadow-md ${
        type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
    }`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Función para extraer hashtags
function extractHashtags(content) {
    const hashtagRegex = /#(\w+)/g;
    return content.match(hashtagRegex) || [];
}

// Archivo: js/loadPosts.js
const POSTS_PER_PAGE = 10;
let currentPage = 0;
let isLoading = false;

// Función para obtener posts desde Parse
async function fetchPosts(page = 0, limit = POSTS_PER_PAGE, category = null) {
    const Post = Parse.Object.extend("Post");
    const query = new Parse.Query(Post);

    query.descending("createdAt");
    query.limit(limit);
    query.skip(page * limit);
    query.include("author");

    if (category) query.equalTo("category", category);

    try {
        return await query.find();
    } catch (error) {
        console.error("Error al cargar los posts:", error);
        showNotification("Error al cargar los posts. Inténtalo nuevamente.", "error");
        return [];
    }
}

// Función para renderizar posts en el DOM
function renderPosts(posts, clearExisting = false) {
    const postsContainer = document.getElementById("posts");

    if (clearExisting) postsContainer.innerHTML = "";

    posts.forEach((post) => {
        const content = post.get("content");
        const link = post.get("link");
        const category = post.get("category") || "General";
        const createdAt = post.createdAt;
        const author = post.get("author");
        const authorName = author ? author.get("username") : "Autor desconocido";

        const postElement = document.createElement("article");
        postElement.className = "bg-white p-6 rounded shadow-md mb-6 border border-gray-200";

        postElement.innerHTML = `
            <div class="flex justify-between items-center">
                <h3 class="text-lg font-semibold">
                    <span class="material-icons mr-2">account_circle</span>${authorName}
                </h3>
                <span class="text-gray-500 text-sm">
                    <span class="material-icons mr-1">schedule</span>${new Date(createdAt).toLocaleString()}
                </span>
            </div>
            <p class="mt-2 text-gray-700">${content}</p>
            ${link ? `<a href="${link}" class="text-blue-600 hover:underline">
                <span class="material-icons mr-1">link</span>Enlace
            </a>` : ""}
            <p class="text-sm text-gray-500 mt-1">Categoría: <span class="text-blue-600">${category}</span></p>
            <div class="flex space-x-4 mt-4">
                <button class="flex items-center text-gray-600 hover:text-blue-600">
                    <span class="material-icons mr-2">thumb_up</span>Me gusta
                </button>
                <button class="flex items-center text-gray-600 hover:text-blue-600">
                    <span class="material-icons mr-2">comment</span>Comentar
                </button>
            </div>
        `;

        postsContainer.appendChild(postElement);
    });
}

// Función para cargar más posts
async function loadMorePosts() {
    if (isLoading) return;

    isLoading = true;
    const posts = await fetchPosts(currentPage, POSTS_PER_PAGE);

    if (posts.length > 0) {
        renderPosts(posts);
        currentPage++;
    } else {
        console.log("No hay más posts para cargar.");
    }

    isLoading = false;
}

// Cargar posts iniciales al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    loadMorePosts();
});

// Archivo: js/category_filter.js
// Función para cargar posts por categoría
async function loadPostsByCategory(category) {
    const posts = await fetchPosts(0, POSTS_PER_PAGE, category);
    renderPosts(posts, true);
}

document.addEventListener("click", (event) => {
    if (event.target.dataset.category) {
        event.preventDefault();
        const category = event.target.dataset.category;
        loadPostsByCategory(category);
    }
});

// Archivo: js/authentication.js
// Función para iniciar sesión
async function logIn(username, password) {
    try {
        const user = await Parse.User.logIn(username, password);
        showNotification(`¡Bienvenido, ${user.get("username") || "usuario"}!`);
        window.location.reload();
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        showNotification(`Error: ${error.message}`, "error");
    }
}

// Función para cerrar sesión
async function logOut() {
    try {
        await Parse.User.logOut();
        showNotification("¡Has cerrado sesión exitosamente!");
        window.location.reload();
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        showNotification(`Error: ${error.message}`, "error");
    }
}

// Verificar el usuario actual al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    const currentUser = Parse.User.current();
    if (currentUser) {
        console.log(`Usuario autenticado: ${currentUser.get("username")}`);
    } else {
        console.log("No hay usuario autenticado.");
    }
});
