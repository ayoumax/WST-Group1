// ==========================================================================
// MotorPH IT Support - Technician Assigned Tickets
// ==========================================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const filterForm =
            document.getElementById(
                "technicianFilterForm"
            );

        const searchInput =
            document.getElementById(
                "staff-search"
            );

        const statusSelect =
            document.getElementById(
                "staff-status"
            );

        const filterResetBtn =
            document.getElementById(
                "filter-reset-btn"
            );

        const filterFeedback =
            document.getElementById(
                "filter-feedback"
            );

        const tableBody =
            document.getElementById(
                "technicianTicketTableBody"
            );

        const noTicketsMessage =
            document.getElementById(
                "noTechnicianTickets"
            );


        let tickets = [];


        // ==================================================
        // STATUS CSS CLASS
        // ==================================================

        function getStatusClass(status) {

            if (status === "in-progress") {
                return "progress";
            }

            if (status === "resolved") {
                return "resolved";
            }

            if (status === "closed") {
                return "closed";
            }

            return "open";
        }


        // ==================================================
        // CREATE BASIC CELL
        // ==================================================

        function createCell(text) {

            const cell =
                document.createElement("td");

            cell.textContent =
                text || "-";

            return cell;
        }


        // ==================================================
        // DISPLAY TICKETS
        // ==================================================

        function displayTickets(ticketList) {

            tableBody.innerHTML = "";


            if (ticketList.length === 0) {

                noTicketsMessage.hidden =
                    false;

                return;

            }


            noTicketsMessage.hidden =
                true;


            ticketList.forEach(
                function (ticket) {

                    const row =
                        document.createElement("tr");


                    // ------------------------------------------
                    // TICKET ID
                    // ------------------------------------------

                    const idCell =
                        document.createElement("td");


                    const idLink =
                        document.createElement("a");


                    idLink.className =
                        "ticket-link";


                    idLink.href =
                        "technician-ticket-detail.html?id=" +
                        encodeURIComponent(
                            ticket.id
                        );


                    idLink.textContent =
                        ticket.id;


                    idCell.appendChild(
                        idLink
                    );


                    row.appendChild(
                        idCell
                    );


                    // ------------------------------------------
                    // EMPLOYEE
                    // ------------------------------------------

                    row.appendChild(
                        createCell(
                            ticket.employeeName ||
                            ticket.submittedBy ||
                            "Employee"
                        )
                    );


                    // ------------------------------------------
                    // CATEGORY
                    // ------------------------------------------

                    row.appendChild(
                        createCell(
                            ticket.categoryText ||
                            ticket.category
                        )
                    );


                    // ------------------------------------------
                    // PRIORITY
                    // ------------------------------------------

                    const priorityCell =
                        document.createElement("td");


                    const priorityBadge =
                        document.createElement("span");


                    priorityBadge.className =
                        "priority " +
                        (
                            ticket.priority ||
                            ""
                        );


                    priorityBadge.textContent =
                        ticket.priorityText ||
                        ticket.priority ||
                        "-";


                    priorityCell.appendChild(
                        priorityBadge
                    );


                    row.appendChild(
                        priorityCell
                    );


                    // ------------------------------------------
                    // STATUS
                    // ------------------------------------------

                    const statusCell =
                        document.createElement("td");


                    const statusBadge =
                        document.createElement("span");


                    statusBadge.className =
                        "status " +
                        getStatusClass(
                            ticket.status
                        );


                    statusBadge.textContent =
                        ticket.statusText ||
                        ticket.status ||
                        "Unknown";


                    statusCell.appendChild(
                        statusBadge
                    );


                    row.appendChild(
                        statusCell
                    );


                    // ------------------------------------------
                    // TECHNICIAN
                    // ------------------------------------------

                    row.appendChild(
                        createCell(
                            ticket.assignedTech ||
                            ticket.technician ||
                            "Unassigned"
                        )
                    );


                    // ------------------------------------------
                    // ACTION
                    // ------------------------------------------

                    const actionCell =
                        document.createElement("td");


                    const detailsLink =
                        document.createElement("a");


                    detailsLink.className =
                        "ticket-link";


                    detailsLink.href =
                        "technician-ticket-detail.html?id=" +
                        encodeURIComponent(
                            ticket.id
                        );


                    detailsLink.textContent =
                        "View Details";


                    actionCell.appendChild(
                        detailsLink
                    );


                    row.appendChild(
                        actionCell
                    );


                    tableBody.appendChild(
                        row
                    );

                }
            );

        }


        // ==================================================
        // FILTER TICKETS
        // ==================================================

        function filterTickets() {

            const searchText =
                searchInput.value
                    .trim()
                    .toLowerCase();


            const selectedStatus =
                statusSelect.value;


            const filteredTickets =
                tickets.filter(
                    function (ticket) {

                        const ticketId =
                            String(
                                ticket.id || ""
                            ).toLowerCase();


                        const employee =
                            String(
                                ticket.employeeName ||
                                ticket.submittedBy ||
                                ""
                            ).toLowerCase();


                        const category =
                            String(
                                ticket.categoryText ||
                                ticket.category ||
                                ""
                            ).toLowerCase();


                        const priority =
                            String(
                                ticket.priorityText ||
                                ticket.priority ||
                                ""
                            ).toLowerCase();


                        const technician =
                            String(
                                ticket.assignedTech ||
                                ticket.technician ||
                                ""
                            ).toLowerCase();


                        const matchesSearch =
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


                        const matchesStatus =
                            selectedStatus === "all" ||
                            ticket.status ===
                                selectedStatus;


                        return (
                            matchesSearch &&
                            matchesStatus
                        );

                    }
                );


            displayTickets(
                filteredTickets
            );


            if (
                filteredTickets.length === 0
            ) {

                filterFeedback.textContent =
                    "No tickets match your search criteria.";

                filterFeedback.style.color =
                    "#B91C1C";

            } else if (
                filteredTickets.length ===
                tickets.length
            ) {

                filterFeedback.textContent =
                    "Showing all " +
                    tickets.length +
                    " ticket(s).";

                filterFeedback.style.color =
                    "var(--text-muted)";

            } else {

                filterFeedback.textContent =
                    "Showing " +
                    filteredTickets.length +
                    " of " +
                    tickets.length +
                    " ticket(s).";

                filterFeedback.style.color =
                    "var(--text-muted)";

            }

        }


        // ==================================================
        // LOAD TICKETS FROM SERVER
        // ==================================================

        async function loadTickets() {

            filterFeedback.textContent =
                "Loading tickets...";


            try {

                const response =
                    await fetch(
                        "/tickets"
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    filterFeedback.textContent =
                        data.message ||
                        "Unable to load tickets.";

                    filterFeedback.style.color =
                        "#B91C1C";

                    return;

                }


                tickets =
                    Array.isArray(data.tickets)
                        ? data.tickets
                        : [];


                displayTickets(
                    tickets
                );


                filterFeedback.textContent =
                    "Showing all " +
                    tickets.length +
                    " ticket(s).";


                filterFeedback.style.color =
                    "var(--text-muted)";

            } catch (error) {

                console.error(
                    "Error loading technician tickets:",
                    error
                );


                filterFeedback.textContent =
                    "Unable to connect to the server.";

                filterFeedback.style.color =
                    "#B91C1C";

            }

        }


        // ==================================================
        // FILTER FORM
        // ==================================================

        filterForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                filterTickets();

            }
        );


        // ==================================================
        // SEARCH WHILE TYPING
        // ==================================================

        searchInput.addEventListener(
            "input",
            function () {

                filterTickets();

            }
        );


        // ==================================================
        // STATUS FILTER
        // ==================================================

        statusSelect.addEventListener(
            "change",
            function () {

                filterTickets();

            }
        );


        // ==================================================
        // RESET
        // ==================================================

        filterResetBtn.addEventListener(
            "click",
            function () {

                searchInput.value =
                    "";

                statusSelect.value =
                    "all";

                displayTickets(
                    tickets
                );


                filterFeedback.textContent =
                    "Showing all " +
                    tickets.length +
                    " ticket(s).";


                filterFeedback.style.color =
                    "var(--text-muted)";

            }
        );


        // ==================================================
        // INITIAL LOAD
        // ==================================================

        loadTickets();

    }
);