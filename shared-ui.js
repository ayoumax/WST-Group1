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

// Highlight the sidebar link for the current page.
const currentPage = window.location.pathname.split("/").pop();

document.querySelectorAll(".sidebar-nav a").forEach(function (link) {
    const linkPage = new URL(link.href).pathname.split("/").pop();
    const isCurrentPage = linkPage === currentPage;

    link.classList.toggle("active", isCurrentPage);

    if (isCurrentPage) {
        link.setAttribute("aria-current", "page");
    } else {
        link.removeAttribute("aria-current");
    }
});