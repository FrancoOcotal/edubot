document.addEventListener("DOMContentLoaded", () => {
    // Función para abrir un modal
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove("hidden");
        } else {
            console.error(`No se encontró el modal con ID: ${modalId}`);
        }
    }

    // Función para cerrar un modal
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add("hidden");
        } else {
            console.error(`No se encontró el modal con ID: ${modalId}`);
        }
    }

    // Escuchar clics para abrir modales
    document.querySelectorAll("[data-open-modal]").forEach((button) => {
        button.addEventListener("click", () => {
            const modalId = button.getAttribute("data-open-modal");
            openModal(modalId);
        });
    });

    // Escuchar clics para cerrar modales
    document.querySelectorAll("[data-close-modal]").forEach((button) => {
        button.addEventListener("click", () => {
            const modalId = button.getAttribute("data-close-modal");
            closeModal(modalId);
        });
    });
});
