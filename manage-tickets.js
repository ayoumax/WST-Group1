// ==========================================================================
// MotorPH IT Support - Assigned Tickets
// ==========================================================================

document.addEventListener("DOMContentLoaded", function () {

    var STORAGE_KEY =
        "motorphTickets";


    var filterForm =
        document.querySelector(".filter-form");

    var searchInput =
        document.getElementById("staff-search");

    var statusSelect =
        document.getElementById("staff-status");

    var filterResetBtn =
        document.getElementById("filter-reset-btn");

    var filterFeedback =
        document.getElementById("filter-feedback");

    var tableBody =
        document.getElementById("technicianTicketTableBody");


    // Get tickets saved by the employee
    function getSavedTickets() {

        var savedTickets =
            localStorage.getItem(STORAGE_KEY);


        if (savedTickets === null) {
            return [];
        }


        return JSON.parse(savedTickets);

    }


    // Add assigned localStorage tickets
    function loadAssignedTickets() {

        var savedTickets =
            getSavedTickets();


        for (
            var i = 0;
            i < savedTickets.length;
            i++
        ) {

            var ticket =
                savedTickets[i];


            // Only display tickets that were assigned
            if (
                !ticket.technician ||
                ticket.technician === ""
            ) {

                continue;

            }


            var row =
                document.createElement("tr");


            // Ticket ID
            var idCell =
                document.createElement("td");

            idCell.textContent =
                ticket.id;


            // Employee
            var employeeCell =
                document.createElement("td");

            employeeCell.textContent =
                "Employee";


            // Category
            var categoryCell =
                document.createElement("td");

            categoryCell.textContent =
                ticket.categoryText ||
                ticket.category;


            // Priority
            var priorityCell =
                document.createElement("td");

            var priorityBadge =
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
            var statusCell =
                document.createElement("td");

            var statusBadge =
                document.createElement("span");


            if (
                ticket.status === "in-progress"
            ) {

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
            var technicianCell =
                document.createElement("td");

            technicianCell.textContent =
                ticket.technician;


            // Add cells to row
            row.appendChild(
                idCell
            );

            row.appendChild(
                employeeCell
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

            row.appendChild(
                technicianCell
            );


            tableBody.appendChild(
                row
            );

        }

    }


    // Load assigned tickets first
    loadAssignedTickets();


    // Get all rows after local tickets are added
    var ticketRows =
        tableBody.querySelectorAll("tr");


    var totalTickets =
        ticketRows.length;


    // Search and filter
    function filterTickets() {

        var searchText =
            searchInput.value
                .toLowerCase()
                .trim();

        var selectedStatus =
            statusSelect.value
                .toLowerCase()
                .trim();

        var visibleCount =
            0;


        for (
            var i = 0;
            i < ticketRows.length;
            i++
        ) {

            var row =
                ticketRows[i];


            var ticketId =
                row.cells[0]
                    .textContent
                    .toLowerCase();

            var employee =
                row.cells[1]
                    .textContent
                    .toLowerCase();

            var category =
                row.cells[2]
                    .textContent
                    .toLowerCase();

            var priority =
                row.cells[3]
                    .textContent
                    .toLowerCase();

            var technician =
                row.cells[5]
                    .textContent
                    .toLowerCase();


            var statusElement =
                row.cells[4]
                    .querySelector(
                        ".status"
                    );


            var statusText =
                statusElement
                    ? statusElement
                        .textContent
                        .toLowerCase()
                        .trim()
                    : "";


            // Search condition
            var matchesSearch =
                searchText === "" ||
                ticketId.includes(
                    searchText
                ) ||
                employee.includes(
                    searchText
                ) ||
                category.includes(
                    searchText
                ) ||
                priority.includes(
                    searchText
                ) ||
                technician.includes(
                    searchText
                );


            // Status condition
            var matchesStatus =
                false;


            if (
                selectedStatus === "all"
            ) {

                matchesStatus =
                    true;

            } else if (
                selectedStatus ===
                    "in-progress" &&
                statusText ===
                    "in progress"
            ) {

                matchesStatus =
                    true;

            } else if (
                selectedStatus ===
                statusText
            ) {

                matchesStatus =
                    true;

            }


            // Show or hide row
            if (
                matchesSearch &&
                matchesStatus
            ) {

                row.style.display =
                    "";

                visibleCount++;

            } else {

                row.style.display =
                    "none";

            }

        }


        // Update message
        if (visibleCount === 0) {

            filterFeedback.textContent =
                "No tickets match your search criteria.";

            filterFeedback.style.color =
                "#B91C1C";

        } else if (
            visibleCount === totalTickets
        ) {

            filterFeedback.textContent =
                "Showing all " +
                totalTickets +
                " tickets.";

            filterFeedback.style.color =
                "var(--text-muted)";

        } else {

            filterFeedback.textContent =
                "Showing " +
                visibleCount +
                " of " +
                totalTickets +
                " tickets.";

            filterFeedback.style.color =
                "var(--text-muted)";

        }

    }


    // Display correct initial total
    filterFeedback.textContent =
        "Showing all " +
        totalTickets +
        " tickets.";


    // Filter button
    if (filterForm) {

        filterForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                filterTickets();

            }
        );

    }


    // Search while typing
    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                filterTickets();

            }
        );

    }


    // Filter when status changes
    if (statusSelect) {

        statusSelect.addEventListener(
            "change",
            function () {

                filterTickets();

            }
        );

    }


    // Reset search/filter
    if (filterResetBtn) {

        filterResetBtn.addEventListener(
            "click",
            function () {

                searchInput.value =
                    "";

                statusSelect.value =
                    "all";

                filterTickets();

            }
        );

    }

});
