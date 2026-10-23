// ==========================================================================
// MotorPH IT Support - Live Administrator Dashboard
// ==========================================================================

document.addEventListener("DOMContentLoaded", function () {
    const summaryCards = document.querySelectorAll(
        ".admin-summary-cards .summary-card"
    );

    const metricBanner = document.getElementById("admin-metric-detail");
    const metricText = document.getElementById("admin-metric-text");
    const clearMetricButton = document.getElementById("admin-clear-metric");

    const technicianList = document.querySelector(".technician-list");
    const activityList = document.querySelector(".activity-list");
    const activityCount = document.getElementById("activity-filter-count");
    const filterButtons = document.querySelectorAll(".activity-filter-btn");
    const queueCount = document.querySelector(".admin-queue-summary strong");

    let tickets = [];
    let loaded = false;
    let selectedFilter = "all";
    let selectedMetric = null;

    const descriptions = {
        total: "All support tickets.",
        open: "Tickets with Open status.",
        progress: "Tickets currently in progress.",
        resolved: "Tickets marked as resolved.",
        unassigned: "Tickets without an assigned technician.",
        closed: "Tickets marked as closed."
    };

    let counts = {};

    function statusOf(ticket) {
        const status = String(ticket.status || "").trim().toLowerCase();

        return status === "progress" ? "in-progress" : status;
    }

    function technicianOf(ticket) {
        return String(
            ticket.assignedTech || ticket.technician || ""
        ).trim();
    }

    function isUnassigned(ticket) {
        const name = technicianOf(ticket).toLowerCase();

        return name === "" || name === "unassigned";
    }

    function showMessage(container, message) {
        if (!container) return;

        const paragraph = document.createElement("p");
        paragraph.textContent = message;
        container.replaceChildren(paragraph);
    }

    async function request(url) {
        const response = await fetch(url, {
            cache: "no-store"
        });

        if (response.status === 401) {
            window.location.replace("index.html");
            throw new Error("Please log in again.");
        }

        if (response.status === 403) {
            throw new Error("You do not have permission to load this data.");
        }

        if (!response.ok) {
            throw new Error("Unable to load dashboard data. Please refresh.");
        }

        return response.json();
    }

    function renderCounts() {
        counts = {
            total: tickets.length,
            open: tickets.filter(t => statusOf(t) === "open").length,
            progress: tickets.filter(
                t => statusOf(t) === "in-progress"
            ).length,
            resolved: tickets.filter(
                t => statusOf(t) === "resolved"
            ).length,
            unassigned: tickets.filter(isUnassigned).length,
            closed: tickets.filter(
                t => statusOf(t) === "closed"
            ).length
        };

        summaryCards.forEach(function (card) {
            const value = card.querySelector("strong");

            if (value) {
                value.textContent = counts[card.dataset.metric];
            }
        });

        if (queueCount) {
            queueCount.textContent = `${counts.unassigned} Unassigned`;
        }

        ["urgent", "high", "medium", "low"].forEach(function (priority) {
            const badge = document.querySelector(
                `.priority-overview-list .priority.${priority}`
            );

            const value = badge
                ?.closest(".overview-row")
                ?.querySelector("strong");

            if (value) {
                value.textContent = tickets.filter(function (ticket) {
                    return String(ticket.priority || "")
                        .trim()
                        .toLowerCase() === priority;
                }).length;
            }
        });

        if (selectedMetric) {
            showMetric(selectedMetric);
        }
    }

    function showMetric(key) {
        if (!metricBanner || !metricText) return;

        metricText.textContent = loaded
            ? `${counts[key]} — ${descriptions[key]}`
            : "Ticket data is not available yet.";

        metricBanner.style.display = "flex";
    }

    summaryCards.forEach(function (card) {
        card.style.cursor = "pointer";

        card.addEventListener("click", function () {
            selectedMetric = card.dataset.metric;

            summaryCards.forEach(function (item) {
                item.style.borderColor = "var(--card-border)";
            });

            card.style.borderColor = "var(--sidebar-active)";
            showMetric(selectedMetric);
        });
    });

    clearMetricButton?.addEventListener("click", function () {
        selectedMetric = null;
        metricBanner.style.display = "none";

        summaryCards.forEach(function (card) {
            card.style.borderColor = "var(--card-border)";
        });
    });

    function renderWorkload(technicians) {
        if (!technicianList) return;

        technicianList.replaceChildren();

        if (technicians.length === 0) {
            showMessage(technicianList, "No technician accounts found.");
            return;
        }

        technicians.forEach(function (technician) {
            const row = document.createElement("div");
            row.className = "technician-row";

            const details = document.createElement("div");

            const name = document.createElement("strong");
            name.textContent = technician.name;

            const role = document.createElement("span");
            role.textContent = "IT Technician";

            const workload = document.createElement("div");
            workload.className = "workload-count";

            const assignedCount = tickets.filter(function (ticket) {
                return technicianOf(ticket) === technician.name;
            }).length;

            workload.textContent =
                `${assignedCount} ${assignedCount === 1 ? "Ticket" : "Tickets"}`;

            details.append(name, role);
            row.append(details, workload);
            technicianList.appendChild(row);
        });
    }

    // Show current records without inventing historical events or dates.
    const activitySection = activityList?.closest("article");
    const activityHeading = activitySection?.querySelector("h3");
    const activityDescription = activitySection?.querySelector(
        ".admin-card-heading p"
    );

    if (activityHeading) {
        activityHeading.textContent = "Ticket Overview";
    }

    if (activityDescription) {
        activityDescription.textContent =
            "Current ticket records, assignments, and statuses.";
    }

    filterButtons.forEach(function (button) {
        if (button.dataset.type === "ticket") {
            button.textContent = "Unassigned";
        }

        if (button.dataset.type === "assigned") {
            button.textContent = "Assigned";
        }

        button.addEventListener("click", function () {
            selectedFilter = button.dataset.type;

            filterButtons.forEach(function (item) {
                const active = item === button;

                item.style.backgroundColor = active
                    ? "var(--sidebar-active)"
                    : "var(--card-bg)";

                item.style.color = active
                    ? "#FFFFFF"
                    : "var(--text-dark)";
            });

            if (loaded) {
                renderTickets();
            }
        });
    });

    function renderTickets() {
        if (!activityList) return;

        const filtered = tickets.filter(function (ticket) {
            if (selectedFilter === "ticket") {
                return isUnassigned(ticket);
            }

            if (selectedFilter === "assigned") {
                return !isUnassigned(ticket);
            }

            if (selectedFilter === "resolved") {
                return ["resolved", "closed"].includes(statusOf(ticket));
            }

            return true;
        });

        activityList.replaceChildren();

        if (activityCount) {
            activityCount.textContent =
                `Showing ${filtered.length} of ${tickets.length} tickets`;
        }

        if (filtered.length === 0) {
            showMessage(activityList, "No tickets match this filter.");
            return;
        }

        filtered.forEach(function (ticket) {
            const item = document.createElement("div");
            item.className = "activity-item";

            const icon = document.createElement("div");
            icon.className = "activity-icon";
            icon.textContent = "•";

            const details = document.createElement("div");

            const link = document.createElement("a");
            link.className = "ticket-link";
            link.href = "admin-tickets.html";

            const title = document.createElement("strong");
            title.textContent = `${ticket.id} — ${ticket.subject}`;
            link.appendChild(title);

            const assignment = document.createElement("p");
            assignment.textContent = isUnassigned(ticket)
                ? "Assigned to: Unassigned"
                : `Assigned to: ${technicianOf(ticket)}`;

            const status = document.createElement("small");
            const labels = {
                open: "Open",
                "in-progress": "In Progress",
                resolved: "Resolved",
                closed: "Closed"
            };

            status.textContent =
                `Status: ${labels[statusOf(ticket)] || "Unknown"}`;

            details.append(link, assignment, status);
            item.append(icon, details);
            activityList.appendChild(item);
        });
    }

    async function loadDashboard() {
        try {
            const data = await request("/tickets");

            if (!Array.isArray(data.tickets)) {
                throw new Error("The server returned invalid ticket data.");
            }

            tickets = data.tickets;
            loaded = true;

            renderCounts();
            renderTickets();
        } catch (error) {
            console.error("Dashboard loading failed:", error);
            showMessage(activityList, error.message);
            showMessage(technicianList, "Unable to load technician workload.");

            if (activityCount) {
                activityCount.textContent = "Unable to load tickets";
            }

            return;
        }

        try {
            const data = await request("/technicians");

            if (!Array.isArray(data.technicians)) {
                throw new Error("The server returned invalid technician data.");
            }

            renderWorkload(data.technicians);
        } catch (error) {
            console.error("Workload loading failed:", error);
            showMessage(technicianList, error.message);
        }
    }

    // Announcement preview: display entered text safely on this page.
    const noticeInput = document.getElementById("system-notice-input");
    const noticeType = document.getElementById("system-notice-type");
    const previewButton = document.getElementById("post-notice-btn");
    const announcementContainer = document.getElementById(
        "admin-announcement-container"
    );

    previewButton?.addEventListener("click", function () {
        if (!noticeInput || !announcementContainer) return;

        const message = noticeInput.value.trim();

        if (!message) {
            noticeInput.focus();
            return;
        }

        const urgent = noticeType?.value === "urgent";
        const banner = document.createElement("div");
        banner.className = "admin-live-banner";

        Object.assign(banner.style, {
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: urgent ? "#FDECEC" : "#E8F1FF",
            border: urgent ? "1px solid #FCA5A5" : "1px solid #B8D5FC",
            color: urgent ? "#991B1B" : "#0F52AA"
        });

        const text = document.createElement("div");
        text.textContent =
            `${urgent ? "Urgent preview" : "Announcement preview"}: ${message}`;

        const dismiss = document.createElement("button");
        dismiss.type = "button";
        dismiss.textContent = "Dismiss";
        dismiss.addEventListener("click", () => banner.remove());

        banner.append(text, dismiss);
        announcementContainer.prepend(banner);
        noticeInput.value = "";
    });

    loadDashboard();
});