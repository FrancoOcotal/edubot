// Inicializar Fuse.js con configuraciones específicas
let fuse;

// Configuración inicial para Fuse.js y carga de publicaciones
async function initializeSearch() {
    const posts = await fetchAllPosts();
    const fuseOptions = {
        keys: [
            { name: "content", weight: 0.6 },
            { name: "category", weight: 0.3 },
            { name: "enlace", weight: 0.1 },
        ],
        threshold: 0.4, // Permite coincidencias más amplias
        ignoreLocation: true, // Ignorar la ubicación de coincidencia exacta
        minMatchCharLength: 2, // Coincidencias de al menos 2 caracteres
        shouldSort: true, // Ordenar resultados por relevancia
    };
    fuse = new Fuse(posts, fuseOptions);
}

// Obtener todas las publicaciones desde la base de datos
async function fetchAllPosts() {
    const Post = Parse.Object.extend("Post");
    const query = new Parse.Query(Post);
    query.include("author");

    try {
        const results = await query.find();
        return results.map((post) => ({
            id: post.id,
            content: normalizeText(post.get("content")),
            category: normalizeText(post.get("category")),
            enlace: post.get("link") || "No disponible",
            author: post.get("author") ? post.get("author").get("username") : "Desconocido",
        }));
    } catch (error) {
        console.error("Error al obtener publicaciones:", error);
        return [];
    }
}

// Normalizar texto para mejorar la búsqueda
function normalizeText(text) {
    return text ? text.toLowerCase().replace(/[^a-z0-9áéíóúñü ]/gi, "") : "";
}

// Función para realizar la búsqueda con Fuse.js
async function searchPosts(query) {
    if (!fuse) {
        await initializeSearch();
    }

    const normalizedQuery = normalizeText(query); // Normalizar entrada del usuario
    const results = fuse.search(normalizedQuery);
    return results.map((result) => result.item); // Retornar los elementos coincidentes
}

// Manejar eventos del formulario de búsqueda
document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("searchInput");
    const resultsContainer = document.getElementById("resultsContainer");

    if (searchForm) {
        searchForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const query = searchInput.value.trim();

            if (!query) {
                resultsContainer.innerHTML = "<p class='text-gray-500'>Por favor, ingresa un término de búsqueda.</p>";
                return;
            }

            resultsContainer.innerHTML = "<p class='text-gray-500'>Buscando...</p>";

            try {
                const results = await searchPosts(query);

                resultsContainer.innerHTML = "";

                if (results.length === 0) {
                    resultsContainer.innerHTML = "<p class='text-gray-500'>No se encontraron resultados.</p>";
                } else {
                    results.forEach((result) => {
                        const postElement = document.createElement("div");
                        postElement.className = "bg-white p-4 rounded shadow-md mb-4";
                        postElement.innerHTML = `
                            <h3 class="text-lg font-semibold">${result.content}</h3>
                            <p class="text-sm text-gray-500 mt-2">Categoría: ${result.category}</p>
                            <p class="text-sm text-gray-500 mt-1">Autor: ${result.author}</p>
                            <p class="text-sm text-gray-500 mt-1">Enlace: <a href="${result.enlace}" target="_blank" class="text-blue-500 hover:underline">${result.enlace}</a></p>
                        `;
                        resultsContainer.appendChild(postElement);
                    });
                }
            } catch (error) {
                console.error("Error al buscar publicaciones:", error);
                resultsContainer.innerHTML = "<p class='text-red-500'>Hubo un error al buscar. Inténtalo nuevamente.</p>";
            }
        });
    }
});
