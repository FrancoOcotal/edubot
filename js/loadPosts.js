// Variables globales para la paginación
let currentPage = 0;
const postsPerPage = 10;
let isLoading = false; // Previene múltiples solicitudes simultáneas

// Función para obtener posts desde Back4App
async function fetchPosts(page = 0, limit = 10) {
    if (typeof Parse === "undefined") {
        console.error("Parse no está inicializado. Asegúrate de incluir el CDN correcto.");
        return [];
    }

    const Post = Parse.Object.extend("Post");
    const query = new Parse.Query(Post);

    query.descending("createdAt"); // Ordenar por fecha de creación
    query.limit(limit); // Número de posts por página
    query.skip(page * limit); // Saltar los posts ya cargados
    query.include("author"); // Incluir información del autor

    try {
        return await query.find();
    } catch (error) {
        console.error("Error al cargar los posts:", error);
        return [];
    }
}

// Función para renderizar los posts en la página
function renderPosts(posts) {
    const postsContainer = document.getElementById("posts");

    posts.forEach((post) => {
        // Crear elementos HTML para el post
        const postElement = document.createElement("article");
        postElement.className = "bg-white p-6 rounded shadow-md mb-6";

        const content = post.get("content");
        const link = post.get("link");
        const category = post.get("category");
        const createdAt = post.createdAt;
        const author = post.get("author");
        const authorName = author ? author.get("username") : "Autor desconocido";

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

        // Agregar el post al contenedor
        postsContainer.appendChild(postElement);
    });
}

// Función para cargar más posts al desplazarse hacia abajo
async function loadMorePosts() {
    if (isLoading) return;

    isLoading = true;
    const posts = await fetchPosts(currentPage, postsPerPage);
    if (posts.length > 0) {
        renderPosts(posts);
        currentPage++;
    } else {
        console.log("No hay más posts para cargar.");
    }
    isLoading = false;
}

// Evento para detectar el desplazamiento al final de la página
window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !isLoading) {
        loadMorePosts();
    }
});

// Cargar los primeros posts al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    loadMorePosts();
});
