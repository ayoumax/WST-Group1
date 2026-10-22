document.addEventListener(
    "DOMContentLoaded",
    function () {

        const ticketTableBody =
            document.getElementById(
                "ticketTableBody"
            );

        const filterForm =
            document.getElementById(
                "ticketFilterForm"
            );

        const searchInput =
            document.getElementById(
                "ticket-search"
            );

        const statusFilter =
            document.getElementById(
                "status-filter"
            );

        const clearFiltersButton =
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

        const ticketLoadMessage =
            document.getElementById(
                "ticketLoadMessage"
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
        // CREATE ONE TABLE CELL
        // ==================================================

        function createCell(text) {

            const td =
                document.createElement("td");

            td.textContent =
                text || "-";

            return td;
        }


        // ==================================================
        // DISPLAY TICKETS
        // ==================================================

        function displayTickets(ticketList) {

            ticketTableBody.innerHTML = "";


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
                        "ticket-row";


                    row.dataset.ticketId =
                        ticket.id || "";


                    row.dataset.subject =
                        ticket.subject || "";


                    row.dataset.status =
                        ticket.status || "";


                    // Ticket ID
                    row.appendChild(
                        createCell(ticket.id)
                    );


                    // Subject
                    row.appendChild(
                        createCell(
                            ticket.subject
                        )
                    );


                    // Category
                    row.appendChild(
                        createCell(
                            ticket.categoryText ||
                            ticket.category
                        )
                    );


                    // Priority
                    row.appendChild(
                        createCell(
                            ticket.priorityText ||
                            ticket.priority
                        )
                    );


                    // Status
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


                    // Submitted Date
                    row.appendChild(
                        createCell(
                            ticket.submitted
                        )
                    );


                    // View Details
                    const actionCell =
                        document.createElement("td");


                    const detailsLink =
                        document.createElement("a");


                    detailsLink.className =
                        "ticket-link";


                    detailsLink.href =
                        "ticket-detail.html?id=" +
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


                    ticketTableBody.appendChild(
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
                statusFilter.value;


            const filteredTickets =
                tickets.filter(
                    function (ticket) {

                        const ticketId =
                            String(
                                ticket.id || ""
                            ).toLowerCase();


                        const subject =
                            String(
                                ticket.subject || ""
                            ).toLowerCase();


                        const matchesSearch =
                            ticketId.includes(
                                searchText
                            ) ||
                            subject.includes(
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


            filterResult.textContent =
                filteredTickets.length +
                " ticket(s) found.";


            filterResult.hidden =
                false;

        }


        // ==================================================
        // LOAD TICKETS FROM SERVER
        // ==================================================

        async function loadTickets() {

            ticketLoadMessage.hidden =
                false;


            ticketLoadMessage.textContent =
                "Loading tickets...";


            try {

                const response =
                    await fetch(
                        "/tickets"
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    ticketLoadMessage.textContent =
                        data.message ||
                        "Unable to load tickets.";

                    return;

                }


                tickets =
                    Array.isArray(data.tickets)
                        ? data.tickets
                        : [];


                ticketLoadMessage.hidden =
                    true;


                displayTickets(
                    tickets
                );

            } catch (error) {

                console.error(
                    "Error loading tickets:",
                    error
                );


                ticketLoadMessage.textContent =
                    "Unable to connect to the server.";

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
        // CLEAR FILTERS
        // ==================================================

        clearFiltersButton.addEventListener(
            "click",
            function () {

                searchInput.value =
                    "";

                statusFilter.value =
                    "all";

                filterResult.hidden =
                    true;

                displayTickets(
                    tickets
                );

            }
        );


        // ==================================================
        // INITIAL LOAD
        // ==================================================

        loadTickets();

    }
);