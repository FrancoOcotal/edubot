// Crear notificación visual
function showNotification(message, type = "success") {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.className = `fixed top-4 right-4 py-2 px-4 rounded shadow-md ${
        type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"
    }`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Función para crear un post
async function createPost(content, link, category) {
    if (typeof Parse === "undefined") {
        console.error("Parse no está inicializado. Verifica el CDN.");
        showNotification("Error interno del sistema.", "error");
        return;
    }

    const currentUser = Parse.User.current();
    if (!currentUser) {
        showNotification("Debes iniciar sesión para publicar.", "error");
        return;
    }

    const hashtags = extractHashtags(content);
    const mainCategory = hashtags.length > 0 ? hashtags[0] : category || "General";

    const Post = Parse.Object.extend("Post");
    const post = new Post();

    post.set("content", content);
    post.set("link", link || null);
    post.set("category", mainCategory);
    post.set("hashtags", hashtags);
    post.set("likes", 0);
    post.set("author", currentUser);

    try {
        await post.save();
        showNotification("¡Publicación creada con éxito!");

        const form = document.querySelector("form");
        form.reset();

        const newPostHtml = `
            <div class="post bg-white p-4 rounded shadow-md">
                <p>${content}</p>
                ${link ? `<a href="${link}" target="_blank" class="text-blue-600 underline">Descargar</a>` : ""}
                <p class="text-sm text-gray-500 mt-2">Categoría: ${mainCategory}</p>
            </div>
        `;
        document.getElementById("posts").insertAdjacentHTML("afterbegin", newPostHtml);
    } catch (error) {
        console.error("Error al crear la publicación:", error);
        showNotification("Error al crear la publicación. Intenta nuevamente.", "error");
    }
}

// Extraer hashtags del contenido
function extractHashtags(content) {
    const hashtagRegex = /#(\w+)/g;
    const matches = content.match(hashtagRegex);
    return matches ? matches.map((tag) => tag.slice(1)) : [];
}

// Manejar el evento del formulario
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const content = form.querySelector("textarea").value.trim();
        const link = form.querySelector("input[type='url']").value.trim();
        const category = "General";

        if (!content) {
            showNotification("El contenido de la publicación no puede estar vacío.", "error");
            return;
        }

        createPost(content, link, category);
    });
});
