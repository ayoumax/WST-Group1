console.log("MotorPH JavaScript connected successfully.");


// =========================================================
// LOCAL STORAGE SETTINGS
// =========================================================

const STORAGE_KEY = "motorphTickets";


// Get locally saved tickets
function getSavedTickets() {

    const savedTickets =
        localStorage.getItem(STORAGE_KEY);

    if (savedTickets === null) {
        return [];
    }

    return JSON.parse(savedTickets);
}


// Save tickets to localStorage
function saveTickets(tickets) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(tickets)
    );

}


// Generate the next ticket number
function generateTicketId() {

    const savedTickets = getSavedTickets();

    let highestNumber = 1003;


    savedTickets.forEach(function (ticket) {

        const ticketNumber =
            parseInt(
                ticket.id.replace("TCK-", "")
            );

        if (ticketNumber > highestNumber) {
            highestNumber = ticketNumber;
        }

    });


    return "TCK-" + (highestNumber + 1);

}


// =========================================================
// SUBMIT TICKET PAGE
// =========================================================

const ticketForm =
    document.getElementById("ticketForm");


if (ticketForm) {

    const subjectInput =
        document.getElementById("subject");

    const categoryInput =
        document.getElementById("category");

    const priorityInput =
        document.getElementById("priority");

    const departmentInput =
        document.getElementById("department");

    const deviceInput =
        document.getElementById("device");

    const descriptionInput =
        document.getElementById("description");


    const ticketFeedback =
        document.getElementById("ticketFeedback");

    const feedbackTitle =
        document.getElementById("feedbackTitle");

    const feedbackMessage =
        document.getElementById("feedbackMessage");


    const submittedSubject =
        document.getElementById("submittedSubject");

    const submittedCategory =
        document.getElementById("submittedCategory");

    const submittedPriority =
        document.getElementById("submittedPriority");

    const submittedDepartment =
        document.getElementById("submittedDepartment");

    const submittedDevice =
        document.getElementById("submittedDevice");


    // Respond when employee submits a ticket
    ticketForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            // Read user input
            const subject =
                subjectInput.value.trim();

            const category =
                categoryInput.value;

            const priority =
                priorityInput.value;

            const department =
                departmentInput.value.trim();

            const device =
                deviceInput.value.trim();

            const description =
                descriptionInput.value.trim();


            // Validate required fields
            if (
                subject === "" ||
                category === "" ||
                description === ""
            ) {

                feedbackTitle.textContent =
                    "Unable to Submit Ticket";

                feedbackMessage.textContent =
                    "Please complete the Subject, Category, and Problem Description fields.";

                ticketFeedback.className =
                    "ticket-feedback error";

                ticketFeedback.hidden =
                    false;

                return;
            }


            // Get displayed text from selected options
            const categoryText =
                categoryInput.options[
                    categoryInput.selectedIndex
                ].text.trim();

            const priorityText =
                priorityInput.options[
                    priorityInput.selectedIndex
                ].text.trim();


            // Generate new ticket ID
            const newTicketId =
                generateTicketId();


            // Get today's date
            const submittedDate =
                new Date().toLocaleDateString(
                    "en-US",
                    {
                        month: "long",
                        day: "numeric",
                        year: "numeric"
                    }
                );


            // Create ticket object
            const newTicket = {

                id: newTicketId,

                subject: subject,

                category: category,

                categoryText: categoryText,

                priority: priority,

                priorityText: priorityText,

                department:
                    department === ""
                        ? "Not provided"
                        : department,

                device:
                    device === ""
                        ? "Not provided"
                        : device,

                description: description,

                status: "open",

                statusText: "Open",

                submitted: submittedDate
            };


            // Get existing tickets
            const savedTickets =
                getSavedTickets();


            // Add new ticket
            savedTickets.push(
                newTicket
            );


            // Save updated list
            saveTickets(
                savedTickets
            );


            // Conditional feedback based on priority
            if (priority === "urgent") {

                feedbackTitle.textContent =
                    "Urgent Ticket Submitted";

                feedbackMessage.textContent =
                    newTicketId +
                    " has been saved. Your urgent request will be prioritized by the IT Support team.";

            } else if (priority === "high") {

                feedbackTitle.textContent =
                    "High Priority Ticket Submitted";

                feedbackMessage.textContent =
                    newTicketId +
                    " has been saved. Your high-priority request will be reviewed as soon as possible.";

            } else {

                feedbackTitle.textContent =
                    "Ticket Submitted Successfully";

                feedbackMessage.textContent =
                    newTicketId +
                    " has been saved. The IT Support team will review your request.";

            }


            // Display submitted information
            submittedSubject.textContent =
                subject;

            submittedCategory.textContent =
                categoryText;

            submittedPriority.textContent =
                priorityText;

            submittedDepartment.textContent =
                newTicket.department;

            submittedDevice.textContent =
                newTicket.device;


            // Show confirmation
            ticketFeedback.className =
                "ticket-feedback success";

            ticketFeedback.hidden =
                false;


            ticketFeedback.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });

        }
    );


    // Clear feedback when form is reset
    ticketForm.addEventListener(
        "reset",
        function () {

            ticketFeedback.hidden =
                true;

        }
    );

}


// =========================================================
// MY TICKETS - DISPLAY LOCALLY SAVED TICKETS
// =========================================================

const ticketTableBody =
    document.getElementById("ticketTableBody");


if (ticketTableBody) {

    const savedTickets =
        getSavedTickets();


    // Add each locally saved ticket below the default tickets
    savedTickets.forEach(
        function (ticket) {

            const row =
                document.createElement("tr");


            row.className =
                "ticket-row";


            row.dataset.ticketId =
                ticket.id;

            row.dataset.subject =
                ticket.subject;

            row.dataset.status =
                ticket.status;


            // Ticket ID
            const idCell =
                document.createElement("td");

            idCell.textContent =
                ticket.id;


            // Subject
            const subjectCell =
                document.createElement("td");

            subjectCell.textContent =
                ticket.subject;


            // Category
            const categoryCell =
                document.createElement("td");

            categoryCell.textContent =
                ticket.categoryText;


            // Priority
            const priorityCell =
                document.createElement("td");

            priorityCell.textContent =
                ticket.priorityText;


            // Status
            const statusCell =
                document.createElement("td");

            const statusBadge =
                document.createElement("span");

            statusBadge.className =
                "status open";

            statusBadge.textContent =
                ticket.statusText;

            statusCell.appendChild(
                statusBadge
            );


            // Submitted date
            const submittedCell =
                document.createElement("td");

            submittedCell.textContent =
                ticket.submitted;


            // Action
            const actionCell =
                document.createElement("td");

            const localLabel =
                document.createElement("span");

            localLabel.className =
                "ticket-link";

            localLabel.textContent =
                "Saved Ticket";

            actionCell.appendChild(
                localLabel
            );


            // Add all cells to row
            row.appendChild(idCell);

            row.appendChild(subjectCell);

            row.appendChild(categoryCell);

            row.appendChild(priorityCell);

            row.appendChild(statusCell);

            row.appendChild(submittedCell);

            row.appendChild(actionCell);


            // Add row to table
            ticketTableBody.appendChild(
                row
            );

        }
    );

}


// =========================================================
// MY TICKETS SEARCH AND FILTER
// =========================================================

const ticketFilterForm =
    document.getElementById(
        "ticketFilterForm"
    );


if (ticketFilterForm) {

    const ticketSearch =
        document.getElementById(
            "ticket-search"
        );

    const statusFilter =
        document.getElementById(
            "status-filter"
        );

    const clearFilters =
        document.getElementById(
            "clearFilters"
        );

    const filterResult =
        document.getElementById(
            "filterResult"
        );

    const noTicketsMessage =
        document.getElementById(
            "noTicketsMessage"
        );


    // Apply filters
    function filterEmployeeTickets() {

        const searchText =
            ticketSearch.value
                .trim()
                .toLowerCase();

        const selectedStatus =
            statusFilter.value;


        // Get rows after localStorage tickets
        // have already been added
        const ticketRows =
            document.querySelectorAll(
                ".ticket-row"
            );


        let visibleTickets = 0;


        ticketRows.forEach(
            function (row) {

                const ticketId =
                    row.dataset.ticketId
                        .toLowerCase();

                const subject =
                    row.dataset.subject
                        .toLowerCase();

                const status =
                    row.dataset.status;


                // Check search input
                const matchesSearch =
                    ticketId.includes(
                        searchText
                    ) ||
                    subject.includes(
                        searchText
                    );


                // Check status
                const matchesStatus =
                    selectedStatus === "all" ||
                    status === selectedStatus;


                // Show only matching tickets
                if (
                    matchesSearch &&
                    matchesStatus
                ) {

                    row.style.display =
                        "";

                    visibleTickets++;

                } else {

                    row.style.display =
                        "none";

                }

            }
        );


        // Display result count
        filterResult.hidden =
            false;


        if (visibleTickets === 0) {

            filterResult.textContent =
                "No matching tickets found.";

            noTicketsMessage.hidden =
                false;

        } else if (
            visibleTickets === 1
        ) {

            filterResult.textContent =
                "1 matching ticket found.";

            noTicketsMessage.hidden =
                true;

        } else {

            filterResult.textContent =
                visibleTickets +
                " matching tickets found.";

            noTicketsMessage.hidden =
                true;

        }

    }


    // Filter button
    ticketFilterForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            filterEmployeeTickets();

        }
    );


    // Clear filters
    clearFilters.addEventListener(
        "click",
        function () {

            ticketSearch.value =
                "";

            statusFilter.value =
                "all";


            const ticketRows =
                document.querySelectorAll(
                    ".ticket-row"
                );


            ticketRows.forEach(
                function (row) {

                    row.style.display =
                        "";

                }
            );


            filterResult.hidden =
                true;

            noTicketsMessage.hidden =
                true;

        }
    );

}

// =========================================================
// EMPLOYEE DASHBOARD
// =========================================================

const employeeRecentTickets =
    document.getElementById("employeeRecentTickets");


if (employeeRecentTickets) {

    const employeeTotalTickets =
        document.getElementById("employeeTotalTickets");

    const employeeOpenTickets =
        document.getElementById("employeeOpenTickets");

    const employeeProgressTickets =
        document.getElementById("employeeProgressTickets");

    const employeeResolvedTickets =
        document.getElementById("employeeResolvedTickets");


    const savedTickets =
        getSavedTickets();


    // Default sample ticket counts
    let totalTickets =
        3;

    let openTickets =
        1;

    let progressTickets =
        1;

    let resolvedTickets =
        1;


    // Count tickets saved in localStorage
    savedTickets.forEach(
        function (ticket) {

            totalTickets++;


            if (ticket.status === "open") {

                openTickets++;

            } else if (
                ticket.status === "in-progress"
            ) {

                progressTickets++;

            } else if (
                ticket.status === "resolved"
            ) {

                resolvedTickets++;

            }

        }
    );


    // Update dashboard numbers
    employeeTotalTickets.textContent =
        totalTickets;

    employeeOpenTickets.textContent =
        openTickets;

    employeeProgressTickets.textContent =
        progressTickets;

    employeeResolvedTickets.textContent =
        resolvedTickets;


    // Add locally saved tickets to Recent Tickets
    savedTickets
        .slice()
        .reverse()
        .forEach(
            function (ticket) {

                const row =
                    document.createElement("tr");


                // Ticket ID
                const idCell =
                    document.createElement("td");

                idCell.textContent =
                    ticket.id;


                // Issue
                const issueCell =
                    document.createElement("td");

                issueCell.textContent =
                    ticket.subject;


                // Category
                const categoryCell =
                    document.createElement("td");

                categoryCell.textContent =
                    ticket.categoryText ||
                    ticket.category;


                // Priority
                const priorityCell =
                    document.createElement("td");

                priorityCell.textContent =
                    ticket.priorityText ||
                    ticket.priority;


                // Status
                const statusCell =
                    document.createElement("td");

                const statusBadge =
                    document.createElement("span");


                if (ticket.status === "in-progress") {

                    statusBadge.className =
                        "status progress";

                    statusBadge.textContent =
                        "In Progress";

                } else if (
                    ticket.status === "resolved"
                ) {

                    statusBadge.className =
                        "status resolved";

                    statusBadge.textContent =
                        "Resolved";

                } else if (
                    ticket.status === "closed"
                ) {

                    statusBadge.className =
                        "status closed";

                    statusBadge.textContent =
                        "Closed";

                } else {

                    statusBadge.className =
                        "status open";

                    statusBadge.textContent =
                        "Open";

                }


                statusCell.appendChild(
                    statusBadge
                );


                // Add cells to row
                row.appendChild(
                    idCell
                );

                row.appendChild(
                    issueCell
                );

                row.appendChild(
                    categoryCell
                );

                row.appendChild(
                    priorityCell
                );

                row.appendChild(
                    statusCell
                );


                // Put newest saved ticket above the sample tickets
                employeeRecentTickets.insertBefore(
                    row,
                    employeeRecentTickets.firstChild
                );

            }
        );

}

// =========================================================
// ADMIN - ALL TICKETS
// =========================================================

const adminTicketTableBody =
    document.getElementById("adminTicketTableBody");


if (adminTicketTableBody) {

    const savedTickets =
        getSavedTickets();


    // Add locally saved employee tickets
    savedTickets.forEach(
        function (ticket) {

            const row =
                document.createElement("tr");


            row.className =
                "admin-ticket-row";

            row.dataset.ticketId =
                ticket.id;

            row.dataset.employee =
                "Employee";

            row.dataset.subject =
                ticket.subject;

            row.dataset.status =
                ticket.status;


            // Ticket ID
            const idCell =
                document.createElement("td");

            idCell.textContent =
                ticket.id;


            // Employee
            const employeeCell =
                document.createElement("td");

            employeeCell.textContent =
                "Employee";


            // Department
            const departmentCell =
                document.createElement("td");

            departmentCell.textContent =
                ticket.department ||
                "Not provided";


            // Issue
            const issueCell =
                document.createElement("td");

            issueCell.textContent =
                ticket.subject;


            // Priority
            const priorityCell =
                document.createElement("td");

            const priorityBadge =
                document.createElement("span");


            priorityBadge.className =
                "priority " +
                ticket.priority;

            priorityBadge.textContent =
                ticket.priorityText ||
                ticket.priority;


            priorityCell.appendChild(
                priorityBadge
            );


            // Status
            const statusCell =
                document.createElement("td");

            const statusBadge =
                document.createElement("span");


            if (ticket.status === "in-progress") {

                statusBadge.className =
                    "status progress";

                statusBadge.textContent =
                    "In Progress";

            } else if (
                ticket.status === "resolved"
            ) {

                statusBadge.className =
                    "status resolved";

                statusBadge.textContent =
                    "Resolved";

            } else if (
                ticket.status === "closed"
            ) {

                statusBadge.className =
                    "status closed";

                statusBadge.textContent =
                    "Closed";

            } else {

                statusBadge.className =
                    "status open";

                statusBadge.textContent =
                    "Open";

            }


            statusCell.appendChild(
                statusBadge
            );


            // Assigned technician
            const technicianCell =
                document.createElement("td");

            technicianCell.textContent =
                ticket.technician ||
                "Unassigned";


            // Add cells
            row.appendChild(
                idCell
            );

            row.appendChild(
                employeeCell
            );

            row.appendChild(
                departmentCell
            );

            row.appendChild(
                issueCell
            );

            row.appendChild(
                priorityCell
            );

            row.appendChild(
                statusCell
            );

            row.appendChild(
                technicianCell
            );


            adminTicketTableBody.appendChild(
                row
            );

        }
    );

}


// =========================================================
// ADMIN - SEARCH AND FILTER
// =========================================================

const adminTicketFilterForm =
    document.getElementById(
        "adminTicketFilterForm"
    );


if (adminTicketFilterForm) {

    const adminSearch =
        document.getElementById(
            "admin-search"
        );

    const adminStatus =
        document.getElementById(
            "admin-status"
        );

    const adminClearFilters =
        document.getElementById(
            "adminClearFilters"
        );

    const adminFilterResult =
        document.getElementById(
            "adminFilterResult"
        );

    const adminNoTicketsMessage =
        document.getElementById(
            "adminNoTicketsMessage"
        );


    function filterAdminTickets() {

        const searchText =
            adminSearch.value
                .trim()
                .toLowerCase();

        const selectedStatus =
            adminStatus.value;


        const ticketRows =
            document.querySelectorAll(
                ".admin-ticket-row"
            );


        let visibleTickets =
            0;


        ticketRows.forEach(
            function (row) {

                const ticketId =
                    row.dataset.ticketId
                        .toLowerCase();

                const employee =
                    row.dataset.employee
                        .toLowerCase();

                const subject =
                    row.dataset.subject
                        .toLowerCase();

                const status =
                    row.dataset.status;


                const matchesSearch =
                    ticketId.includes(
                        searchText
                    ) ||
                    employee.includes(
                        searchText
                    ) ||
                    subject.includes(
                        searchText
                    );


                const matchesStatus =
                    selectedStatus === "all" ||
                    status === selectedStatus;


                if (
                    matchesSearch &&
                    matchesStatus
                ) {

                    row.style.display =
                        "";

                    visibleTickets++;

                } else {

                    row.style.display =
                        "none";

                }

            }
        );


        adminFilterResult.hidden =
            false;


        if (visibleTickets === 0) {

            adminFilterResult.textContent =
                "No matching tickets found.";

            adminNoTicketsMessage.hidden =
                false;

        } else if (
            visibleTickets === 1
        ) {

            adminFilterResult.textContent =
                "1 matching ticket found.";

            adminNoTicketsMessage.hidden =
                true;

        } else {

            adminFilterResult.textContent =
                visibleTickets +
                " matching tickets found.";

            adminNoTicketsMessage.hidden =
                true;

        }

    }


    adminTicketFilterForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            filterAdminTickets();

        }
    );


    adminClearFilters.addEventListener(
        "click",
        function () {

            adminSearch.value =
                "";

            adminStatus.value =
                "all";


            const ticketRows =
                document.querySelectorAll(
                    ".admin-ticket-row"
                );


            ticketRows.forEach(
                function (row) {

                    row.style.display =
                        "";

                }
            );


            adminFilterResult.hidden =
                true;

            adminNoTicketsMessage.hidden =
                true;

        }
    );

}