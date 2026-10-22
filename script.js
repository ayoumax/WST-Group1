console.log("MotorPH JavaScript connected successfully.");


// =========================================================
// LOCAL STORAGE SETTINGS
// Existing display pages still use these until GET routes
// are connected.
// =========================================================

const STORAGE_KEY = "motorphTickets";

function getSavedTickets() {
    const savedTickets = localStorage.getItem(STORAGE_KEY);

    if (savedTickets === null) {
        return [];
    }

    return JSON.parse(savedTickets);
}

function saveTickets(tickets) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(tickets)
    );
}


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
// MY TICKETS - DISPLAY LOCALLY SAVED TICKETS
// =========================================================

const ticketTableBody = document.getElementById("ticketTableBody");

if (ticketTableBody) {
    const savedTickets = getSavedTickets();

    savedTickets.forEach(function (ticket) {
        const row = document.createElement("tr");

        row.className = "ticket-row";
        row.dataset.ticketId = ticket.id;
        row.dataset.subject = ticket.subject;
        row.dataset.status = ticket.status;

        const idCell = document.createElement("td");
        idCell.textContent = ticket.id;

        const subjectCell = document.createElement("td");
        subjectCell.textContent = ticket.subject;

        const categoryCell = document.createElement("td");
        categoryCell.textContent = ticket.categoryText;

        const priorityCell = document.createElement("td");
        priorityCell.textContent = ticket.priorityText;

        const statusCell = document.createElement("td");
        const statusBadge = document.createElement("span");

        if (ticket.status === "in-progress") {
            statusBadge.className = "status progress";
            statusBadge.textContent = "In Progress";
        } else if (ticket.status === "resolved") {
            statusBadge.className = "status resolved";
            statusBadge.textContent = "Resolved";
        } else if (ticket.status === "closed") {
            statusBadge.className = "status closed";
            statusBadge.textContent = "Closed";
        } else {
            statusBadge.className = "status open";
            statusBadge.textContent = "Open";
        }

        statusCell.appendChild(statusBadge);

        const submittedCell = document.createElement("td");
        submittedCell.textContent = ticket.submitted;

        const actionCell = document.createElement("td");
        const localLabel = document.createElement("span");

        localLabel.className = "ticket-link";
        localLabel.textContent = "Saved Ticket";

        actionCell.appendChild(localLabel);

        row.appendChild(idCell);
        row.appendChild(subjectCell);
        row.appendChild(categoryCell);
        row.appendChild(priorityCell);
        row.appendChild(statusCell);
        row.appendChild(submittedCell);
        row.appendChild(actionCell);

        ticketTableBody.appendChild(row);
    });
}


// =========================================================
// MY TICKETS SEARCH AND FILTER
// =========================================================

const ticketFilterForm = document.getElementById("ticketFilterForm");

if (ticketFilterForm) {
    const ticketSearch = document.getElementById("ticket-search");
    const statusFilter = document.getElementById("status-filter");
    const clearFilters = document.getElementById("clearFilters");
    const filterResult = document.getElementById("filterResult");
    const noTicketsMessage = document.getElementById("noTicketsMessage");

    function filterEmployeeTickets() {
        const searchText = ticketSearch.value.trim().toLowerCase();
        const selectedStatus = statusFilter.value;
        const ticketRows = document.querySelectorAll(".ticket-row");

        let visibleTickets = 0;

        ticketRows.forEach(function (row) {
            const ticketId = row.dataset.ticketId.toLowerCase();
            const subject = row.dataset.subject.toLowerCase();
            const status = row.dataset.status;

            const matchesSearch =
                ticketId.includes(searchText) ||
                subject.includes(searchText);

            const matchesStatus =
                selectedStatus === "all" ||
                status === selectedStatus;

            if (matchesSearch && matchesStatus) {
                row.style.display = "";
                visibleTickets++;
            } else {
                row.style.display = "none";
            }
        });

        filterResult.hidden = false;
        noTicketsMessage.hidden = visibleTickets !== 0;

        if (visibleTickets === 0) {
            filterResult.textContent = "No matching tickets found.";
        } else if (visibleTickets === 1) {
            filterResult.textContent = "1 matching ticket found.";
        } else {
            filterResult.textContent =
                visibleTickets + " matching tickets found.";
        }
    }

    ticketFilterForm.addEventListener("submit", function (event) {
        event.preventDefault();
        filterEmployeeTickets();
    });

    clearFilters.addEventListener("click", function () {
        ticketSearch.value = "";
        statusFilter.value = "all";

        document.querySelectorAll(".ticket-row").forEach(function (row) {
            row.style.display = "";
        });

        filterResult.hidden = true;
        noTicketsMessage.hidden = true;
    });
}


// =========================================================
// EMPLOYEE DASHBOARD
// =========================================================

const employeeRecentTickets = document.getElementById(
    "employeeRecentTickets"
);

if (employeeRecentTickets) {
    const employeeTotalTickets = document.getElementById(
        "employeeTotalTickets"
    );

    const employeeOpenTickets = document.getElementById(
        "employeeOpenTickets"
    );

    const employeeProgressTickets = document.getElementById(
        "employeeProgressTickets"
    );

    const employeeResolvedTickets = document.getElementById(
        "employeeResolvedTickets"
    );

    const savedTickets = getSavedTickets();

    // Default sample ticket counts
    let totalTickets = 3;
    let openTickets = 1;
    let progressTickets = 1;
    let resolvedTickets = 1;

    savedTickets.forEach(function (ticket) {
        totalTickets++;

        if (ticket.status === "open") {
            openTickets++;
        } else if (ticket.status === "in-progress") {
            progressTickets++;
        } else if (ticket.status === "resolved") {
            resolvedTickets++;
        }
    });

    employeeTotalTickets.textContent = totalTickets;
    employeeOpenTickets.textContent = openTickets;
    employeeProgressTickets.textContent = progressTickets;
    employeeResolvedTickets.textContent = resolvedTickets;

    savedTickets
        .slice()
        .reverse()
        .forEach(function (ticket) {
            const row = document.createElement("tr");

            const idCell = document.createElement("td");
            idCell.textContent = ticket.id;

            const issueCell = document.createElement("td");
            issueCell.textContent = ticket.subject;

            const categoryCell = document.createElement("td");
            categoryCell.textContent =
                ticket.categoryText || ticket.category;

            const priorityCell = document.createElement("td");
            priorityCell.textContent =
                ticket.priorityText || ticket.priority;

            const statusCell = document.createElement("td");
            const statusBadge = document.createElement("span");

            if (ticket.status === "in-progress") {
                statusBadge.className = "status progress";
                statusBadge.textContent = "In Progress";
            } else if (ticket.status === "resolved") {
                statusBadge.className = "status resolved";
                statusBadge.textContent = "Resolved";
            } else if (ticket.status === "closed") {
                statusBadge.className = "status closed";
                statusBadge.textContent = "Closed";
            } else {
                statusBadge.className = "status open";
                statusBadge.textContent = "Open";
            }

            statusCell.appendChild(statusBadge);

            row.appendChild(idCell);
            row.appendChild(issueCell);
            row.appendChild(categoryCell);
            row.appendChild(priorityCell);
            row.appendChild(statusCell);

            employeeRecentTickets.insertBefore(
                row,
                employeeRecentTickets.firstChild
            );
        });
}


// =========================================================
// ADMIN - ALL TICKETS
// =========================================================

const adminTicketTableBody = document.getElementById(
    "adminTicketTableBody"
);

if (adminTicketTableBody) {
    const savedTickets = getSavedTickets();

    savedTickets.forEach(function (ticket) {
        const row = document.createElement("tr");

        row.className = "admin-ticket-row";
        row.dataset.ticketId = ticket.id;
        row.dataset.employee = "Employee";
        row.dataset.subject = ticket.subject;
        row.dataset.status = ticket.status;

        const idCell = document.createElement("td");
        idCell.textContent = ticket.id;

        const employeeCell = document.createElement("td");
        employeeCell.textContent = "Employee";

        const departmentCell = document.createElement("td");
        departmentCell.textContent =
            ticket.department || "Not provided";

        const issueCell = document.createElement("td");
        issueCell.textContent = ticket.subject;

        const priorityCell = document.createElement("td");
        const priorityBadge = document.createElement("span");

        priorityBadge.className = "priority " + ticket.priority;
        priorityBadge.textContent =
            ticket.priorityText || ticket.priority;

        priorityCell.appendChild(priorityBadge);

        const statusCell = document.createElement("td");
        const statusBadge = document.createElement("span");

        if (ticket.status === "in-progress") {
            statusBadge.className = "status progress";
            statusBadge.textContent = "In Progress";
        } else if (ticket.status === "resolved") {
            statusBadge.className = "status resolved";
            statusBadge.textContent = "Resolved";
        } else if (ticket.status === "closed") {
            statusBadge.className = "status closed";
            statusBadge.textContent = "Closed";
        } else {
            statusBadge.className = "status open";
            statusBadge.textContent = "Open";
        }

        statusCell.appendChild(statusBadge);

        const technicianCell = document.createElement("td");
        technicianCell.textContent =
            ticket.technician || "Unassigned";

        row.appendChild(idCell);
        row.appendChild(employeeCell);
        row.appendChild(departmentCell);
        row.appendChild(issueCell);
        row.appendChild(priorityCell);
        row.appendChild(statusCell);
        row.appendChild(technicianCell);

        adminTicketTableBody.appendChild(row);
    });
}


// =========================================================
// ADMIN - SEARCH AND FILTER
// =========================================================

const adminTicketFilterForm = document.getElementById(
    "adminTicketFilterForm"
);

if (adminTicketFilterForm) {
    const adminSearch = document.getElementById("admin-search");
    const adminStatus = document.getElementById("admin-status");
    const adminClearFilters = document.getElementById("adminClearFilters");
    const adminFilterResult = document.getElementById("adminFilterResult");

    const adminNoTicketsMessage = document.getElementById(
        "adminNoTicketsMessage"
    );

    function filterAdminTickets() {
        const searchText = adminSearch.value.trim().toLowerCase();
        const selectedStatus = adminStatus.value;

        const ticketRows = document.querySelectorAll(
            ".admin-ticket-row"
        );

        let visibleTickets = 0;

        ticketRows.forEach(function (row) {
            const ticketId = row.dataset.ticketId.toLowerCase();
            const employee = row.dataset.employee.toLowerCase();
            const subject = row.dataset.subject.toLowerCase();
            const status = row.dataset.status;

            const matchesSearch =
                ticketId.includes(searchText) ||
                employee.includes(searchText) ||
                subject.includes(searchText);

            const matchesStatus =
                selectedStatus === "all" ||
                status === selectedStatus;

            if (matchesSearch && matchesStatus) {
                row.style.display = "";
                visibleTickets++;
            } else {
                row.style.display = "none";
            }
        });

        adminFilterResult.hidden = false;
        adminNoTicketsMessage.hidden = visibleTickets !== 0;

        if (visibleTickets === 0) {
            adminFilterResult.textContent = "No matching tickets found.";
        } else if (visibleTickets === 1) {
            adminFilterResult.textContent = "1 matching ticket found.";
        } else {
            adminFilterResult.textContent =
                visibleTickets + " matching tickets found.";
        }
    }

    adminTicketFilterForm.addEventListener("submit", function (event) {
        event.preventDefault();
        filterAdminTickets();
    });

    adminClearFilters.addEventListener("click", function () {
        adminSearch.value = "";
        adminStatus.value = "all";

        document.querySelectorAll(".admin-ticket-row").forEach(
            function (row) {
                row.style.display = "";
            }
        );

        adminFilterResult.hidden = true;
        adminNoTicketsMessage.hidden = true;
    });
}