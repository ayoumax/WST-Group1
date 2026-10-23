console.log("MotorPH JavaScript connected successfully.");


// =========================================================
// SUBMIT TICKET PAGE
// =========================================================

const ticketForm = document.getElementById("ticketForm");

if (ticketForm) {
    const subjectInput = document.getElementById("subject");
    const categoryInput = document.getElementById("category");
    const priorityInput = document.getElementById("priority");
    const departmentInput = document.getElementById("department");
    const deviceInput = document.getElementById("device");
    const descriptionInput = document.getElementById("description");

    const ticketFeedback = document.getElementById("ticketFeedback");
    const feedbackTitle = document.getElementById("feedbackTitle");
    const feedbackMessage = document.getElementById("feedbackMessage");

    const submittedSubject = document.getElementById("submittedSubject");
    const submittedCategory = document.getElementById("submittedCategory");
    const submittedPriority = document.getElementById("submittedPriority");
    const submittedDepartment = document.getElementById("submittedDepartment");
    const submittedDevice = document.getElementById("submittedDevice");

    const submittedSummary = ticketFeedback.querySelector(
        ".submitted-ticket-summary"
    );

    const submitButton = ticketForm.querySelector(
        'button[type="submit"]'
    );

    const resetButton = ticketForm.querySelector(
        'button[type="reset"]'
    );

    let submitting = false;

    function showTicketError(message) {
        feedbackTitle.textContent = "Unable to Submit Ticket";
        feedbackMessage.textContent = message;

        submittedSummary.hidden = true;

        ticketFeedback.className = "ticket-feedback error";
        ticketFeedback.hidden = false;

        ticketFeedback.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    }

    ticketForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        if (submitting) {
            return;
        }

        const subject = subjectInput.value.trim();
        const category = categoryInput.value;
        const priority = priorityInput.value;
        const department = departmentInput.value.trim();
        const device = deviceInput.value.trim();
        const description = descriptionInput.value.trim();

        if (
            subject === "" ||
            category === "" ||
            description === ""
        ) {
            showTicketError(
                "Please complete the Subject, Category, and Problem Description fields."
            );

            return;
        }

        // Send only the fields the employee can edit.
        // The server supplies the ID, owner, date, and status.
        const newTicket = {
            subject,
            category,
            priority,
            department,
            device,
            description
        };

        submitting = true;
        submitButton.disabled = true;

        if (resetButton) {
            resetButton.disabled = true;
        }

        ticketFeedback.hidden = true;
        submittedSummary.hidden = true;

        try {
            const response = await fetch("/tickets", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newTicket)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to submit your ticket."
                );
            }

            const savedTicket = data.ticket;

            if (
                !savedTicket ||
                typeof savedTicket.id !== "string"
            ) {
                throw new Error(
                    "The server did not return a ticket ID. Check tickets.json before submitting again."
                );
            }

            // Show confirmation only after the server confirms the save.
            if (savedTicket.priority === "urgent") {
                feedbackTitle.textContent = "Urgent Ticket Submitted";

                feedbackMessage.textContent =
                    savedTicket.id +
                    " has been saved with Urgent priority.";
            } else if (savedTicket.priority === "high") {
                feedbackTitle.textContent = "High Priority Ticket Submitted";

                feedbackMessage.textContent =
                    savedTicket.id +
                    " has been saved with High priority.";
            } else {
                feedbackTitle.textContent = "Ticket Submitted Successfully";

                feedbackMessage.textContent =
                    savedTicket.id +
                    " has been saved. The IT Support team will review your request.";
            }

            // Display the values saved by the backend.
            submittedSubject.textContent = savedTicket.subject;
            submittedCategory.textContent = savedTicket.categoryText;
            submittedPriority.textContent = savedTicket.priorityText;

            submittedDepartment.textContent =
                savedTicket.department || "Not provided";

            submittedDevice.textContent =
                savedTicket.device || "Not provided";

            submittedSummary.hidden = false;

            ticketFeedback.className = "ticket-feedback success";
            ticketFeedback.hidden = false;

            ticketFeedback.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        } catch (error) {
            showTicketError(error.message);
        } finally {
            submitting = false;
            submitButton.disabled = false;

            if (resetButton) {
                resetButton.disabled = false;
            }
        }
    });

    ticketForm.addEventListener("reset", function () {
        ticketFeedback.hidden = true;
        submittedSummary.hidden = true;
    });
}

// =========================================================
// EMPLOYEE DASHBOARD — LIVE BACKEND DATA
// =========================================================

const employeeRecentTickets = document.getElementById(
    "employeeRecentTickets"
);

if (employeeRecentTickets) {
    const counters = {
        total: document.getElementById("employeeTotalTickets"),
        open: document.getElementById("employeeOpenTickets"),
        progress: document.getElementById("employeeProgressTickets"),
        resolved: document.getElementById("employeeResolvedTickets")
    };

    function showDashboardMessage(message) {
        employeeRecentTickets.replaceChildren();

        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 5;
        cell.textContent = message;
        row.appendChild(cell);
        employeeRecentTickets.appendChild(row);
    }

    async function loadEmployeeDashboard() {
        Object.values(counters).forEach(function (counter) {
            counter.textContent = "—";
        });

        showDashboardMessage("Loading tickets...");

        try {
            const response = await fetch("/tickets", {
                cache: "no-store"
            });

            if (response.status === 401) {
                window.location.replace("/index.html");
                return;
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to load tickets."
                );
            }

            if (!Array.isArray(data.tickets)) {
                throw new Error("Invalid ticket data from server.");
            }

            const tickets = data.tickets;

            function normalizeStatus(ticket) {
                return ticket.status === "progress"
                    ? "in-progress"
                    : ticket.status;
            }

            counters.total.textContent = tickets.length;
            counters.open.textContent = tickets.filter(
                ticket => normalizeStatus(ticket) === "open"
            ).length;
            counters.progress.textContent = tickets.filter(
                ticket => normalizeStatus(ticket) === "in-progress"
            ).length;
            counters.resolved.textContent = tickets.filter(
                ticket => normalizeStatus(ticket) === "resolved"
            ).length;

            employeeRecentTickets.replaceChildren();

            if (tickets.length === 0) {
                showDashboardMessage("You have no tickets yet.");
                return;
            }

            const recentTickets = tickets.slice().sort(function (a, b) {
                return (Date.parse(b.createdAt) || 0) -
                    (Date.parse(a.createdAt) || 0);
            }).slice(0, 5);

            recentTickets.forEach(function (ticket) {
                const row = document.createElement("tr");

                [
                    ticket.id,
                    ticket.subject,
                    ticket.categoryText || ticket.category,
                    ticket.priorityText || ticket.priority
                ].forEach(function (value) {
                    const cell = document.createElement("td");
                    cell.textContent = value || "—";
                    row.appendChild(cell);
                });

                const statusCell = document.createElement("td");
                const badge = document.createElement("span");
                const status = normalizeStatus(ticket);

                const statuses = {
                    open: ["open", "Open"],
                    "in-progress": ["progress", "In Progress"],
                    resolved: ["resolved", "Resolved"],
                    closed: ["closed", "Closed"]
                };

                const display = statuses[status] ||
                    ["", "Unknown"];

                badge.className = "status " + display[0];
                badge.textContent = display[1];

                statusCell.appendChild(badge);
                row.appendChild(statusCell);
                employeeRecentTickets.appendChild(row);
            });
        } catch (error) {
            showDashboardMessage(error.message);
        }
    }

    loadEmployeeDashboard();
}