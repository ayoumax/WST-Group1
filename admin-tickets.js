// ==========================================================================
// MotorPH IT Support - Administrator All Tickets
// ==========================================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const filterForm =
            document.getElementById(
                "adminTicketFilterForm"
            );

        const searchInput =
            document.getElementById(
                "admin-search"
            );

        const statusSelect =
            document.getElementById(
                "admin-status"
            );

        const clearButton =
            document.getElementById(
                "adminClearFilters"
            );

        const filterResult =
            document.getElementById(
                "adminFilterResult"
            );

        const tableBody =
            document.getElementById(
                "adminTicketTableBody"
            );

        const noTicketsMessage =
            document.getElementById(
                "adminNoTicketsMessage"
            );


        let tickets = [];


        // ==================================================
        // STATUS CLASS
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
        // CREATE NORMAL TABLE CELL
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


                    row.className =
                        "admin-ticket-row";


                    // ------------------------------------------
                    // TICKET ID
                    // ------------------------------------------

                    row.appendChild(
                        createCell(
                            ticket.id
                        )
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
                    // DEPARTMENT
                    // ------------------------------------------

                    row.appendChild(
                        createCell(
                            ticket.department ||
                            "-"
                        )
                    );


                    // ------------------------------------------
                    // ISSUE / SUBJECT
                    // ------------------------------------------

                    row.appendChild(
                        createCell(
                            ticket.subject ||
                            "-"
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
                        "-";


                    statusCell.appendChild(
                        statusBadge
                    );


                    row.appendChild(
                        statusCell
                    );


                    // ------------------------------------------
                    // ASSIGNED TECHNICIAN
                    // ------------------------------------------

                    row.appendChild(
                        createCell(
                            ticket.assignedTech ||
                            ticket.technician ||
                            "Unassigned"
                        )
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
                                ticket.id ||
                                ""
                            ).toLowerCase();


                        const employee =
                            String(
                                ticket.employeeName ||
                                ticket.submittedBy ||
                                ""
                            ).toLowerCase();


                        const subject =
                            String(
                                ticket.subject ||
                                ""
                            ).toLowerCase();


                        const department =
                            String(
                                ticket.department ||
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
                            subject.includes(
                                searchText
                            ) ||
                            department.includes(
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

                filterResult.textContent =
                    "No tickets match your search criteria.";

                filterResult.style.color =
                    "#B91C1C";

            } else if (
                filteredTickets.length ===
                tickets.length
            ) {

                filterResult.textContent =
                    "Showing all " +
                    tickets.length +
                    " ticket(s).";

                filterResult.style.color =
                    "var(--text-muted)";

            } else {

                filterResult.textContent =
                    "Showing " +
                    filteredTickets.length +
                    " of " +
                    tickets.length +
                    " ticket(s).";

                filterResult.style.color =
                    "var(--text-muted)";

            }

        }


        // ==================================================
        // LOAD ALL TICKETS FROM SERVER
        // ==================================================

        async function loadTickets() {

            filterResult.textContent =
                "Loading tickets...";


            try {

                const response =
                    await fetch(
                        "/tickets"
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    filterResult.textContent =
                        data.message ||
                        "Unable to load tickets.";

                    filterResult.style.color =
                        "#B91C1C";

                    return;

                }


                tickets =
                    Array.isArray(
                        data.tickets
                    )
                        ? data.tickets
                        : [];


                displayTickets(
                    tickets
                );


                filterResult.textContent =
                    "Showing all " +
                    tickets.length +
                    " ticket(s).";


                filterResult.style.color =
                    "var(--text-muted)";

            } catch (error) {

                console.error(
                    "Error loading admin tickets:",
                    error
                );


                filterResult.textContent =
                    "Unable to connect to the server.";

                filterResult.style.color =
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
        // CLEAR FILTERS
        // ==================================================

        clearButton.addEventListener(
            "click",
            function () {

                searchInput.value =
                    "";

                statusSelect.value =
                    "all";


                displayTickets(
                    tickets
                );


                filterResult.textContent =
                    "Showing all " +
                    tickets.length +
                    " ticket(s).";


                filterResult.style.color =
                    "var(--text-muted)";

            }
        );


        // ==================================================
        // INITIAL LOAD
        // ==================================================

        loadTickets();

    }
);