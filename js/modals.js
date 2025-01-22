document.addEventListener("DOMContentLoaded", () => {
            const currentUser = Parse.User.current();
            const postFormSection = document.getElementById("postFormSection");
            const authButtons = document.getElementById("authButtons");
            const userDisplay = document.getElementById("userDisplay");
            const accessRequestDiv = document.getElementById("accessRequestDiv");
            const loginModal = document.getElementById("loginModal");
            const closeModal = document.getElementById("closeModal");
            const modalLogInForm = document.getElementById("modalLogInForm");

            if (currentUser) {
                postFormSection.classList.remove("hidden");
                userDisplay.textContent = `Bienvenido, ${currentUser.get("username") || "Usuario"}`;
                userDisplay.classList.remove("hidden");
                accessRequestDiv.classList.add("hidden");

                authButtons.innerHTML = `
                    <li><button id="logOutButton" class="hover:underline bg-transparent border-none cursor-pointer">
                        <span class="material-icons mr-1">logout</span>
                    </button></li>`;

                document.getElementById("logOutButton").addEventListener("click", (event) => {
                    event.preventDefault();
                    logOut();
                });
            } else {
                authButtons.innerHTML = `
                    <li><button id="logInButton" class="hover:underline bg-transparent border-none cursor-pointer">
                        <span class="material-icons mr-1">login</span>Iniciar Sesión
                    </button></li>`;

                document.getElementById("logInButton").addEventListener("click", () => {
                    loginModal.style.display = "flex";
                });

                closeModal.addEventListener("click", () => {
                    loginModal.style.display = "none";
                });

                modalLogInForm.addEventListener("submit", (event) => {
                    event.preventDefault();
                    const username = modalLogInForm.querySelector("input[name='username']").value;
                    const password = modalLogInForm.querySelector("input[name='password']").value;
                    if (username && password) {
                        logIn(username, password);
                        loginModal.style.display = "none";
                    }
                });
            }
        });