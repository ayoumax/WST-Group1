const sidebar = document.querySelector(".dashboard-page .sidebar");

if (sidebar) {
    const menuButton = document.createElement("button");
    menuButton.type = "button";
    menuButton.className = "mobile-menu-button";
    menuButton.textContent = "☰ Menu";
    menuButton.setAttribute("aria-controls", "site-sidebar");
    menuButton.setAttribute("aria-expanded", "false");

    sidebar.id = "site-sidebar";
    sidebar.before(menuButton);

    menuButton.addEventListener("click", function () {
        const isOpen = sidebar.classList.toggle("is-open");

        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.textContent = isOpen ? "✕ Close menu" : "☰ Menu";
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && sidebar.classList.contains("is-open")) {
            sidebar.classList.remove("is-open");
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.textContent = "☰ Menu";
            menuButton.focus();
        }
    });
}