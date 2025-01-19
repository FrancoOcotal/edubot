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
