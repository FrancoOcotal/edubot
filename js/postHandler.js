// postHandler.js
async function createPost(content, link, category) {
    // Verificar si Parse está inicializado
    if (typeof Parse === "undefined") {
        console.error("Parse no está inicializado. Asegúrate de incluir el CDN correcto.");
        return;
    }

    // Verificar si hay un usuario autenticado
    const currentUser = Parse.User.current();
    if (!currentUser) {
        alert("Debes iniciar sesión para publicar.");
        return;
    }

    // Extraer hashtags del contenido y usar los primeros como categorías si no se define
    const hashtags = extractHashtags(content);
    const mainCategories = hashtags.length > 0 ? hashtags.slice(0, 3) : [category || "General"];

    // Clase Post en Back4App
    const Post = Parse.Object.extend("Post");
    const post = new Post();

    // Asignar valores al post
    post.set("content", content);
    post.set("link", link || null); // Opcional
    post.set("categories", mainCategories); // Guardar múltiples categorías
    post.set("hashtags", hashtags); // Guardar hashtags como lista
    post.set("likes", 0); // Inicializar con 0 likes
    post.set("author", currentUser); // Asignar el autor al post

    try {
        // Guardar en la base de datos
        await post.save();

        // Mostrar notificación de éxito
        const successMessage = document.createElement("div");
        successMessage.textContent = "¡Publicación creada con éxito!";
        successMessage.className = "fixed top-4 right-4 bg-green-500 text-white py-2 px-4 rounded shadow-md";
        document.body.appendChild(successMessage);

        setTimeout(() => successMessage.remove(), 3000); // Desaparece en 3 segundos

        // Limpiar los cuadros de texto
        const form = document.querySelector("form");
        form.reset();

        // Insertar el nuevo post en la página
        const postsContainer = document.getElementById("posts");
        const newPostHtml = `
            <div class="post bg-white p-4 rounded shadow-md">
                <p>${content}</p>
                ${link ? `<a href="${link}" target="_blank" class="text-blue-600 underline">Descargar</a>` : ""}
                <p class="text-sm text-gray-500 mt-2">Categorías: ${mainCategories.join(", ")}</p>
            </div>
        `;
        postsContainer.insertAdjacentHTML("afterbegin", newPostHtml);
    } catch (error) {
        console.error("Error al crear la publicación:", error);
        if (error.code === 101) {
            alert("Error de conexión. Verifica tu red.");
        } else if (error.code === 119) {
            alert("Permiso denegado. Asegúrate de estar autenticado.");
        } else {
            alert("Hubo un problema al crear la publicación. Intenta nuevamente.");
        }
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
