let currentPage = 0;
const postsPerPage = 10;
let isLoading = false; // Previene múltiples solicitudes simultáneas
let currentCategory = null; // Almacena la categoría actual para el filtrado
let loadedPosts = []; // Almacena posts cargados en memoria
const maxPostsInDOM = 30; // Máximo de posts permitidos en el DOM

// Indicador de carga
function showLoadingIndicator(show) {
    const loadingIndicator = document.getElementById("loadingIndicator");
    if (loadingIndicator) {
        loadingIndicator.style.display = show ? "block" : "none";
    }
}

// Función para obtener posts desde Back4App
async function fetchPosts(page = 0, limit = 10, category = null) {
    const Post = Parse.Object.extend("Post");
    const query = new Parse.Query(Post);

    query.descending("createdAt");
    query.limit(limit);
    query.skip(page * limit);
    query.include("author");

    if (category) {
        query.equalTo("category", category);
    }

    try {
        return await query.find();
    } catch (error) {
        console.error("Error al cargar los posts:", error);
        return [];
    }
}

// Función para renderizar los posts visibles
function renderPosts(posts) {
    const postsContainer = document.getElementById("posts");

    // Eliminar posts fuera del límite
    while (postsContainer.childNodes.length > maxPostsInDOM) {
        postsContainer.removeChild(postsContainer.firstChild);
    }

    posts.forEach((post) => {
        const content = post.get("content");
        const link = post.get("link");
        const category = post.get("category");
        const createdAt = post.createdAt;
        const author = post.get("author");
        const pin = post.get("pin"); // Obtener el pin del post

        const authorName = author ? author.get("username") || "Autor desconocido" : "Autor desconocido";

        const postElement = document.createElement("article");
        postElement.className = "bg-white p-6 rounded shadow-md mb-6 border border-gray-200";

        // Si el pin existe, incrustar el iframe de Pinterest
        let pinEmbed = "";
        if (pin) {
            const embedUrl = pin.replace('https://pin.it/', 'https://www.pinterest.com/pin/');
            pinEmbed = `
                <div class="mt-4">
                    <a href="${embedUrl}" data-pin-do="embedPin" data-pin-width="large"></a>
                </div>
            `;
        }

        postElement.innerHTML = `
            <div class="flex justify-between items-center">
                <h3 class="text-lg font-semibold"><span class="material-icons mr-2">account_circle</span>${authorName}</h3>
                <span class="text-gray-500 text-sm"><span class="material-icons mr-1">schedule</span>${new Date(createdAt).toLocaleString()}</span>
            </div>
            <p class="mt-2 text-gray-700">${content}</p>
            ${link ? `<a href="${link}" class="text-blue-600 hover:underline"><span class="material-icons mr-1">link</span>Enlace</a>` : ""}
            ${pinEmbed}
            <p class="text-sm text-gray-500 mt-1">Categoría: <span class="text-blue-600">${category}</span></p>
        `;

        postsContainer.appendChild(postElement);
    });

    // Inicializar el script de Pinterest para renderizar pines
    if (typeof PinUtils !== "undefined") {
        PinUtils.build();
    } else {
        console.error("Pinterest script (PinUtils) no está cargado correctamente.");
    }
}

// Función para cargar más posts
async function loadMorePosts(category = null) {
    if (isLoading) return;

    if (category !== currentCategory) {
        currentPage = 0;
        currentCategory = category;
        loadedPosts = []; // Reiniciar la caché
        document.getElementById("posts").innerHTML = ""; // Limpiar DOM
    }

    isLoading = true;
    showLoadingIndicator(true);

    const posts = await fetchPosts(currentPage, postsPerPage, category);
    loadedPosts = loadedPosts.concat(posts);

    renderPosts(posts); // Renderiza solo los nuevos posts
    currentPage++;

    showLoadingIndicator(false);
    isLoading = false;
}

// Detectar desplazamiento para carga infinita
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
        loadMorePosts(category);
    }
});

// Cargar los primeros posts al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    const currentUser = Parse.User.current();
    if (currentUser) {
        loadMorePosts();
    }
});
