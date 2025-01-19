// Función para publicar un post con hashtags
async function createPost(content, link, category) {
    // Verificar si Parse está inicializado
    if (typeof Parse === "undefined") {
        console.error("Parse no está inicializado. Asegúrate de incluir el CDN correcto.");
        return;
    }

    // Extraer hashtags del contenido y usar el primero como categoría si no se define
    const hashtags = extractHashtags(content);
    const mainCategory = hashtags.length > 0 ? hashtags[0] : category || "General";

    // Clase Post en Back4App
    const Post = Parse.Object.extend("Post");
    const post = new Post();

    // Asignar valores al post
    post.set("content", content);
    post.set("link", link || null); // Opcional
    post.set("category", mainCategory); // Usar hashtag principal como categoría
    post.set("hashtags", hashtags); // Guardar hashtags como lista
    post.set("likes", 0); // Inicializar con 0 likes

    try {
        // Guardar en la base de datos
        await post.save();
        alert("¡Publicación creada con éxito!");

        // Limpiar los cuadros de texto
        document.querySelector("textarea").value = "";
        document.querySelector("input[type='url']").value = "";

        // Cargar los posts actualizados
        const postsContainer = document.getElementById("posts");
        postsContainer.innerHTML = ""; // Limpiar posts actuales
        currentPage = 0; // Reiniciar paginación
        loadMorePosts(); // Cargar los posts desde el principio
    } catch (error) {
        console.error("Error al crear la publicación:", error);
        alert("Hubo un problema al crear la publicación. Intenta nuevamente.");
    }
}

// Función para extraer hashtags del contenido
function extractHashtags(content) {
    const hashtagRegex = /#(\w+)/g;
    const matches = content.match(hashtagRegex);
    return matches ? matches : [];
}

// Función para cargar posts por categoría o hashtag
async function fetchPostsByCategory(category) {
    if (typeof Parse === "undefined") {
        console.error("Parse no está inicializado. Asegúrate de incluir el CDN correcto.");
        return [];
    }

    const Post = Parse.Object.extend("Post");
    const query = new Parse.Query(Post);
    query.equalTo("category", category); // Buscar por categoría que coincida
    query.descending("createdAt");

    try {
        return await query.find();
    } catch (error) {
        console.error("Error al cargar los posts por categoría:", error);
        return [];
    }
}

// Función para redirigir al usuario al hacer clic en un hashtag o categoría
document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("category-link")) {
        event.preventDefault();
        const category = event.target.dataset.category;
        const posts = await fetchPostsByCategory(category);

        // Renderizar los posts filtrados
        const postsContainer = document.getElementById("posts");
        postsContainer.innerHTML = ""; // Limpiar contenido actual
        renderPosts(posts); // Reutilizar función para mostrar posts
    }
});

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

        postElement.innerHTML = `
            <div class="flex justify-between items-center">
                <h3 class="text-lg font-semibold"><i class="fas fa-user-circle mr-2"></i>Autor desconocido</h3>
                <span class="text-gray-500 text-sm"><i class="fas fa-clock mr-1"></i>${new Date(createdAt).toLocaleString()}</span>
            </div>
            <p class="mt-2 text-gray-700">${content}</p>
            ${link ? `<a href="${link}" class="text-blue-600 hover:underline"><i class="fas fa-link mr-1"></i>Enlace</a>` : ""}
            <p class="text-sm text-gray-500 mt-1">Categoría: <a href="#" class="category-link text-blue-600 hover:underline" data-category="${category}">${category}</a></p>
            <div class="flex space-x-4 mt-4">
                <button class="flex items-center text-gray-600 hover:text-blue-600">
                    <i class="fas fa-thumbs-up mr-2"></i>Me gusta
                </button>
                <button class="flex items-center text-gray-600 hover:text-blue-600">
                    <i class="fas fa-comment-alt mr-2"></i>Comentar
                </button>
            </div>
        `;

        // Agregar el post al contenedor
        postsContainer.appendChild(postElement);
    });
}

// Capturar datos del formulario
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    form.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevenir recarga de página

        // Obtener valores del formulario
        const content = form.querySelector("textarea").value;
        const link = form.querySelector("input[type='url']").value;
        const category = "General"; // Cambiar si deseas usar categorías dinámicas

        // Validar datos
        if (!content.trim()) {
            alert("El contenido de la publicación no puede estar vacío.");
            return;
        }

        // Crear post
        createPost(content, link, category);
    });
});
