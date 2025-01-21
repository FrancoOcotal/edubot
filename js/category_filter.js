// category_filter.js
async function fetchPostsByCategory(category) {
    if (typeof Parse === "undefined") {
        console.error("Parse no está inicializado. Asegúrate de incluir el CDN correcto.");
        return [];
    }

    const Post = Parse.Object.extend("Post");
    const query = new Parse.Query(Post);
    query.equalTo("category", category); // Filtrar por categoría
    query.descending("createdAt"); // Ordenar por fecha de creación

    try {
        return await query.find();
    } catch (error) {
        console.error("Error al cargar los posts por categoría:", error);
        return [];
    }
}

// Función para renderizar los posts en la página
function renderPosts(posts) {
    const postsContainer = document.getElementById("posts");
    postsContainer.innerHTML = ""; // Limpiar los posts existentes

    posts.forEach((post) => {
        // Crear elementos HTML para el post
        const postElement = document.createElement("article");
        postElement.className = "bg-white p-6 rounded shadow-md mb-6";

        const content = post.get("content");
        const link = post.get("link");
        const category = post.get("category");
        const createdAt = post.createdAt;

        postElement.innerHTML = `
            <div class="flex justify-between items-center">
                <h3 class="text-lg font-semibold"><span class="material-icons mr-2">account_circle</span>Autor desconocido</h3>
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

// Detectar clics en enlaces de categoría
document.addEventListener("click", async (event) => {
    if (event.target.dataset.category) {
        event.preventDefault(); // Prevenir el comportamiento por defecto del enlace

        const category = event.target.dataset.category;
        const posts = await fetchPostsByCategory(category); // Cargar posts por categoría

        // Renderizar los posts
        renderPosts(posts);
    }
});
