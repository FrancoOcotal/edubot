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

// Función para renderizar posts
function renderPosts(posts) {
    const postsContainer = document.getElementById("posts");

    // Eliminar posts fuera del límite
    while (postsContainer.childNodes.length > maxPostsInDOM) {
        postsContainer.removeChild(postsContainer.firstChild);
        loadedPosts.shift();  // Elimina la primera publicación en el array
    }

    posts.forEach((post) => {
        const content = post.get("content");
        const link = post.get("link");
        const category = post.get("category");
        const createdAt = post.createdAt;
        const author = post.get("author");
        const image = post.get("image");

        const authorName = author ? author.get("username") || "Autor desconocido" : "Autor desconocido";

        const postElement = document.createElement("article");
        postElement.className = "bg-white p-6 rounded shadow-md mb-6 border border-gray-200";

        // Si hay una imagen, incluirla en el diseño
        let imageEmbed = "";
        if (image) {
            imageEmbed = `
                <div class="mt-4">
                    <img src="${image}" alt="Imagen del post" class="w-36 rounded-lg shadow-md">
                </div>
            `;
        }

        postElement.innerHTML = `
            <div data-aos="fade-up" class="flex justify-between items-center">
                <h3 class="text-lg font-semibold">
                    <span class="material-icons mr-2">account_circle</span>${authorName}
                </h3>
                <span class="text-gray-500 text-sm">
                    <span class="material-icons mr-1">schedule</span>${new Date(createdAt).toLocaleString()}
                </span>
            </div>
            <p class="mt-2 text-gray-700">${content}</p>
            ${imageEmbed}
            ${link ? `<a href="${link}" class="text-blue-600 hover:underline"><span class="material-icons mr-1">link</span>Enlace</a>` : ""}
            <p class="text-sm text-gray-500 mt-1">Categoría: <span class="text-blue-600">${category}</span></p>
        `;

        postsContainer.appendChild(postElement);
    });
}

// Función para cargar más posts
async function loadMorePosts(category = null) {
    if (isLoading || (category !== currentCategory && loadedPosts.length >= maxPostsInDOM)) return;

    if (category !== currentCategory) {
        currentPage = 0;
        currentCategory = category;
        // Verifica si ya se han cargado posts para esa categoría
        const existingPosts = loadedPosts.filter(post => post.get("category") === category);
        if (existingPosts.length > 0) {
            renderPosts(existingPosts);
            return;
        }
        loadedPosts = []; // Reiniciar la caché
        document.getElementById("posts").innerHTML = ""; // Limpiar DOM
    }

    isLoading = true;
    showLoadingIndicator(true);

    try {
        const posts = await fetchPosts(currentPage, postsPerPage, category);
        loadedPosts = loadedPosts.concat(posts);
        renderPosts(posts);
        currentPage++;
    } catch (error) {
        console.error("Error al cargar más posts:", error);
    } finally {
        showLoadingIndicator(false);
        isLoading = false;
    }
}

// Detectar desplazamiento para carga infinita con debounce
let debounceTimer;
window.addEventListener("scroll", () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !isLoading) {
            loadMorePosts(currentCategory);
        }
    }, 150);
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
    if (loadedPosts.length === 0) {
        loadMorePosts();
    }
});
