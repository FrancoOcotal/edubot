// loadPosts.js
let currentPage = 0;
const postsPerPage = 10;
let isLoading = false; // Previene múltiples solicitudes simultáneas
let currentCategory = null; // Almacena la categoría actual para el filtrado

// Indicador de carga
function showLoadingIndicator(show) {
    const loadingIndicator = document.getElementById("loadingIndicator");
    if (loadingIndicator) {
        loadingIndicator.style.display = show ? "block" : "none";
    }
}

// Función para obtener posts desde Back4App
async function fetchPosts(page = 0, limit = 10, category = null) {
    if (typeof Parse === "undefined") {
        console.error("Parse no está inicializado. Asegúrate de incluir el CDN correcto.");
        return [];
    }

    const Post = Parse.Object.extend("Post");
    const query = new Parse.Query(Post);

    query.descending("createdAt"); // Ordenar por fecha de creación
    query.limit(limit); // Número de posts por página
    query.skip(page * limit); // Saltar los posts ya cargados
    query.include("author"); // Incluir información del autor (username)

    // Si se proporciona una categoría, filtrar por ella
    if (category) {
        query.equalTo("category", category);
    }

    try {
        return await query.find();
    } catch (error) {
        console.error("Error al cargar los posts:", error);
        showNotification("Error al cargar los posts. Inténtalo nuevamente.", "error");
        return [];
    }
}

// Función para renderizar los posts en la página
function renderPosts(posts, clearExisting = false) {
    const postsContainer = document.getElementById("posts");

    if (clearExisting) {
        postsContainer.innerHTML = ""; // Limpiar posts existentes
    }

    posts.forEach((post) => {
        const content = post.get("content");
        const link = post.get("link");
        const category = post.get("category");
        const createdAt = post.createdAt;
        const author = post.get("author");

        // Verificar si el autor existe y obtener su username
        const authorName = author ? author.get("username") || "Autor desconocido" : "Autor desconocido";

        const postElement = document.createElement("article");
        postElement.className = "bg-white p-6 rounded shadow-md mb-6 border border-gray-200";

        postElement.innerHTML = `
            <div class="flex justify-between items-center">
                <h3 class="text-lg font-semibold"><span class="material-icons mr-2">account_circle</span>${authorName}</h3>
                <span class="text-gray-500 text-sm"><span class="material-icons mr-1">schedule</span>${new Date(createdAt).toLocaleString()}</span>
            </div>
            <p class="mt-2 text-gray-700">${content}</p>
            ${link ? `<a href="${link}" class="text-blue-600 hover:underline"><span class="material-icons mr-1">link</span>Enlace</a>` : ""}
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
async function loadMorePosts(category = null) {
    if (isLoading) return;

    if (category !== currentCategory) {
        currentPage = 0; // Reiniciar paginación si la categoría cambia
        currentCategory = category; // Actualizar la categoría actual
    }

    isLoading = true;
    showLoadingIndicator(true);

    const posts = await fetchPosts(currentPage, postsPerPage, category);
    if (posts.length > 0) {
        renderPosts(posts, currentPage === 0); // Limpiar solo si es la primera página
        currentPage++;
    } else {
        console.log("No hay más posts para cargar.");
    }

    showLoadingIndicator(false);
    isLoading = false;
}

// Función para insertar un solo post (sin recargar todos los posts)
function addSinglePost(postData) {
    renderPosts([postData]);
}

// Detectar el desplazamiento para carga infinita
window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !isLoading) {
        loadMorePosts(currentCategory);
    }
});

// Detectar clics en enlaces de categorías
document.addEventListener("click", (event) => {
    if (event.target.dataset.category) {
        event.preventDefault();
        const category = event.target.dataset.category;
        loadMorePosts(category); // Cargar posts filtrados por categoría
    }
});

// Cargar los primeros posts al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    const currentUser = Parse.User.current();
    if (currentUser) {
        loadMorePosts();
    } else {
        console.log("Usuario no autenticado. No se cargarán los posts.");
    }
});
