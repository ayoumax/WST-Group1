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

    sidebar.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
        sidebar.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.textContent = "☰ Menu";
    });
});

document.addEventListener("click", function (event) {
    const clickedOutside =
        !sidebar.contains(event.target) &&
        !menuButton.contains(event.target);

    if (sidebar.classList.contains("is-open") && clickedOutside) {
        sidebar.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.textContent = "☰ Menu";
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

if (document.querySelector(".dashboard-page")) {
    const topButton = document.createElement("button");
    topButton.type = "button";
    topButton.className = "back-to-top";
    topButton.textContent = "↑ Back to top";
    topButton.setAttribute("aria-label", "Back to top");
    document.body.append(topButton);

    function updateTopButton() {
        topButton.hidden = window.scrollY < 300;
    }

    window.addEventListener("scroll", updateTopButton);
    updateTopButton();

    topButton.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

let toastTimer;

window.showToast = function (message, type = "success") {
    document.querySelector(".shared-toast")?.remove();
    clearTimeout(toastTimer);

    const toast = document.createElement("div");
    toast.className =
        type === "error"
            ? "shared-toast shared-toast-error"
            : "shared-toast shared-toast-success";
    toast.setAttribute("role", type === "error" ? "alert" : "status");
    toast.textContent = message;
    document.body.append(toast);

    toastTimer = setTimeout(function () {
        toast.remove();
    }, 4000);
};

const originalButtonLabels = new WeakMap();

window.setButtonLoading = function (button, isLoading) {
    if (isLoading) {
        if (button.disabled) return;

        originalButtonLabels.set(button, button.textContent);
        button.disabled = true;
        button.textContent = "Please wait...";
    } else {
        button.disabled = false;
        button.textContent =
            originalButtonLabels.get(button) ?? button.textContent;
        originalButtonLabels.delete(button);
    }
};