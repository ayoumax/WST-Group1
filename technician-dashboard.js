// ==========================================================================
// MotorPH IT Support - Technician Dashboard
// ==========================================================================

document.addEventListener("DOMContentLoaded", function () {

    var STORAGE_KEY = "motorphTickets";


    // ----------------------------------------------------------------------
    // PAGE ELEMENTS
    // ----------------------------------------------------------------------

    var summaryCards =
        document.querySelectorAll(".summary-grid .summary-card");

    var countAssigned =
        document.getElementById("count-assigned");

    var countOpen =
        document.getElementById("count-open");

    var countProgress =
        document.getElementById("count-progress");

    var countResolved =
        document.getElementById("count-resolved");

    var filterBanner =
        document.getElementById("technician-filter-banner");

    var filterBannerText =
        document.getElementById("technician-filter-text");

    var resetFilterBtn =
        document.getElementById("technician-reset-filter");

    var updateToast =
        document.getElementById("technician-update-toast");

    var tableBody =
        document.querySelector(".recent-tickets tbody");

    var noteInput =
        document.getElementById("shift-note-input");

    var saveNoteBtn =
        document.getElementById("save-note-btn");

    var noteList =
        document.getElementById("technician-notes-list");

    var currentFilter =
        "all";


    // ----------------------------------------------------------------------
    // LOCAL STORAGE
    // ----------------------------------------------------------------------

    function getSavedTickets() {

        var savedTickets =
            localStorage.getItem(STORAGE_KEY);


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


    // ----------------------------------------------------------------------
    // CREATE OR UPDATE A LOCAL TICKET ROW
    // ----------------------------------------------------------------------

    function displayAssignedTickets() {

        if (!tableBody) {
            return;
        }


        var savedTickets =
            getSavedTickets();


        for (
            var i = 0;
            i < savedTickets.length;
            i++
        ) {

            var ticket =
                savedTickets[i];


            // Only show tickets that already have a technician
            if (
                !ticket.technician ||
                ticket.technician === ""
            ) {

                continue;

            }


            var existingRows =
                tableBody.querySelectorAll("tr");

            var row =
                null;


            // Check if the ticket number is already in the sample table
            for (
                var r = 0;
                r < existingRows.length;
                r++
            ) {

                var firstCell =
                    existingRows[r].cells[0];


                if (
                    firstCell &&
                    firstCell.textContent
                        .trim() === ticket.id
                ) {

                    row =
                        existingRows[r];

                    break;

                }

            }


            // If ticket does not already exist, create a new row
            if (!row) {

                row =
                    document.createElement("tr");

                tableBody.appendChild(
                    row
                );

            }


            // Mark this as a localStorage ticket
            row.dataset.localTicketId =
                ticket.id;


            // Clear old sample content if the same ID existed
            row.innerHTML =
                "";


            // --------------------------------------------------------------
            // TICKET ID
            // --------------------------------------------------------------

            var idCell =
                document.createElement("td");

            var ticketLink =
                document.createElement("span");

            ticketLink.className =
                "ticket-link";

            ticketLink.textContent =
                ticket.id;

            idCell.appendChild(
                ticketLink
            );


            // --------------------------------------------------------------
            // EMPLOYEE
            // --------------------------------------------------------------

            var employeeCell =
                document.createElement("td");

            employeeCell.textContent =
                "Employee";


            // --------------------------------------------------------------
            // ISSUE
            // --------------------------------------------------------------

            var issueCell =
                document.createElement("td");

            issueCell.textContent =
                ticket.subject;


            // --------------------------------------------------------------
            // PRIORITY
            // --------------------------------------------------------------

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


            // --------------------------------------------------------------
            // STATUS
            // --------------------------------------------------------------

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

            } else {

                statusBadge.className =
                    "status open";

                statusBadge.textContent =
                    "Open";

            }


            statusCell.appendChild(
                statusBadge
            );


            // --------------------------------------------------------------
            // QUICK STATUS ACTION
            // --------------------------------------------------------------

            var actionCell =
                document.createElement("td");

            var statusSelect =
                document.createElement("select");

            statusSelect.className =
                "quick-status-select";

            statusSelect.setAttribute(
                "aria-label",
                "Update ticket status"
            );


            var openOption =
                document.createElement("option");

            openOption.value =
                "open";

            openOption.textContent =
                "Open";


            var progressOption =
                document.createElement("option");

            progressOption.value =
                "progress";

            progressOption.textContent =
                "In Progress";


            var resolvedOption =
                document.createElement("option");

            resolvedOption.value =
                "resolved";

            resolvedOption.textContent =
                "Resolved";


            statusSelect.appendChild(
                openOption
            );

            statusSelect.appendChild(
                progressOption
            );

            statusSelect.appendChild(
                resolvedOption
            );


            // Select the correct current status
            if (
                ticket.status === "resolved"
            ) {

                statusSelect.value =
                    "resolved";

            } else if (
                ticket.status === "in-progress"
            ) {

                statusSelect.value =
                    "progress";

            } else {

                statusSelect.value =
                    "open";

            }


            actionCell.appendChild(
                statusSelect
            );


            // Add all cells
            row.appendChild(
                idCell
            );

            row.appendChild(
                employeeCell
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
                actionCell
            );

        }

    }


    // Load assigned localStorage tickets before counting rows
    displayAssignedTickets();


    var ticketRows =
        tableBody
            ? tableBody.querySelectorAll("tr")
            : [];


    // ----------------------------------------------------------------------
    // UPDATE DASHBOARD COUNTS
    // ----------------------------------------------------------------------

    function updateCounts() {

        var openCount =
            0;

        var progressCount =
            0;

        var resolvedCount =
            0;

        var totalCount =
            ticketRows.length;


        for (
            var i = 0;
            i < ticketRows.length;
            i++
        ) {

            var statusBadge =
                ticketRows[i]
                    .querySelector(".status");


            if (statusBadge) {

                var text =
                    statusBadge.textContent
                        .trim()
                        .toLowerCase();


                if (text === "open") {

                    openCount++;

                } else if (
                    text === "in progress"
                ) {

                    progressCount++;

                } else if (
                    text === "resolved"
                ) {

                    resolvedCount++;

                }

            }

        }


        if (countAssigned) {

            countAssigned.textContent =
                totalCount;

        }


        if (countOpen) {

            countOpen.textContent =
                openCount;

        }


        if (countProgress) {

            countProgress.textContent =
                progressCount;

        }


        if (countResolved) {

            countResolved.textContent =
                resolvedCount;

        }

    }


    // ----------------------------------------------------------------------
    // FILTER TABLE
    // ----------------------------------------------------------------------

    function filterTableByStatus(targetStatus) {

        currentFilter =
            targetStatus;

        var visibleCount =
            0;


        for (
            var i = 0;
            i < ticketRows.length;
            i++
        ) {

            var row =
                ticketRows[i];

            var statusBadge =
                row.querySelector(".status");

            var statusText =
                statusBadge
                    ? statusBadge.textContent
                        .trim()
                        .toLowerCase()
                    : "";


            var matches =
                false;


            if (
                targetStatus === "all"
            ) {

                matches =
                    true;

            } else if (
                targetStatus === "open" &&
                statusText === "open"
            ) {

                matches =
                    true;

            } else if (
                targetStatus === "progress" &&
                statusText === "in progress"
            ) {

                matches =
                    true;

            } else if (
                targetStatus === "resolved" &&
                statusText === "resolved"
            ) {

                matches =
                    true;

            }


            if (matches) {

                row.style.display =
                    "";

                visibleCount++;

            } else {

                row.style.display =
                    "none";

            }

        }


        if (filterBanner) {

            if (
                targetStatus === "all"
            ) {

                filterBanner.style.display =
                    "none";

            } else {

                filterBanner.style.display =
                    "flex";


                var labelMap = {

                    open: "Open",

                    progress:
                        "In Progress",

                    resolved:
                        "Resolved Today"

                };


                var displayLabel =
                    labelMap[targetStatus] ||
                    targetStatus;


                filterBannerText.textContent =
                    "Filtered by: " +
                    displayLabel +
                    " (" +
                    visibleCount +
                    " ticket" +
                    (
                        visibleCount === 1
                            ? ""
                            : "s"
                    ) +
                    ")";

            }

        }

    }


    // ----------------------------------------------------------------------
    // SUMMARY CARD CLICKS
    // ----------------------------------------------------------------------

    for (
        var c = 0;
        c < summaryCards.length;
        c++
    ) {

        (function (card) {

            card.style.cursor =
                "pointer";


            card.addEventListener(
                "click",
                function () {

                    var filterType =
                        card.getAttribute(
                            "data-filter"
                        );


                    if (filterType) {

                        filterTableByStatus(
                            filterType
                        );

                    }

                }
            );

        })(summaryCards[c]);

    }


    // Show all button
    if (resetFilterBtn) {

        resetFilterBtn.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                filterTableByStatus(
                    "all"
                );

            }
        );

    }


    // ----------------------------------------------------------------------
    // QUICK STATUS UPDATE
    // ----------------------------------------------------------------------

    var statusSelects =
        document.querySelectorAll(
            ".quick-status-select"
        );


    for (
        var s = 0;
        s < statusSelects.length;
        s++
    ) {

        statusSelects[s].addEventListener(
            "change",
            function (event) {

                var newStatus =
                    event.target.value;

                var row =
                    event.target.closest(
                        "tr"
                    );

                var ticketIdElement =
                    row.querySelector(
                        ".ticket-link"
                    );

                var ticketId =
                    ticketIdElement
                        ? ticketIdElement
                            .textContent
                            .trim()
                        : "Ticket";

                var statusBadge =
                    row.querySelector(
                        ".status"
                    );


                if (
                    newStatus === "open"
                ) {

                    statusBadge.textContent =
                        "Open";

                    statusBadge.className =
                        "status open";

                } else if (
                    newStatus === "progress"
                ) {

                    statusBadge.textContent =
                        "In Progress";

                    statusBadge.className =
                        "status progress";

                } else if (
                    newStatus === "resolved"
                ) {

                    statusBadge.textContent =
                        "Resolved";

                    statusBadge.className =
                        "status resolved";

                }


                // Save status change for localStorage tickets
                var localTicketId =
                    row.dataset.localTicketId;


                if (localTicketId) {

                    var savedTickets =
                        getSavedTickets();


                    for (
                        var i = 0;
                        i < savedTickets.length;
                        i++
                    ) {

                        if (
                            savedTickets[i].id ===
                            localTicketId
                        ) {

                            if (
                                newStatus ===
                                "progress"
                            ) {

                                savedTickets[i].status =
                                    "in-progress";

                                savedTickets[i].statusText =
                                    "In Progress";

                            } else if (
                                newStatus ===
                                "resolved"
                            ) {

                                savedTickets[i].status =
                                    "resolved";

                                savedTickets[i].statusText =
                                    "Resolved";

                            } else {

                                savedTickets[i].status =
                                    "open";

                                savedTickets[i].statusText =
                                    "Open";

                            }


                            break;

                        }

                    }


                    saveTickets(
                        savedTickets
                    );

                }


                updateCounts();


                if (
                    currentFilter !==
                    "all"
                ) {

                    filterTableByStatus(
                        currentFilter
                    );

                }


                if (updateToast) {

                    var statusNames = {

                        open:
                            "Open",

                        progress:
                            "In Progress",

                        resolved:
                            "Resolved"

                    };


                    updateToast.textContent =
                        ticketId +
                        " status updated to " +
                        (
                            statusNames[
                                newStatus
                            ] ||
                            newStatus
                        ) +
                        ".";


                    updateToast.style.display =
                        "block";


                    setTimeout(
                        function () {

                            updateToast.style.display =
                                "none";

                        },
                        3000
                    );

                }

            }
        );

    }


    // ----------------------------------------------------------------------
    // SHIFT HANDOVER NOTES
    // ----------------------------------------------------------------------

    if (
        saveNoteBtn &&
        noteInput &&
        noteList
    ) {

        saveNoteBtn.addEventListener(
            "click",
            function () {

                var noteText =
                    noteInput.value.trim();


                if (noteText === "") {

                    alert(
                        "Please enter a note before saving."
                    );

                    return;

                }


                var newNoteItem =
                    document.createElement(
                        "li"
                    );

                var now =
                    new Date();

                var timeString =
                    now.toLocaleTimeString(
                        [],
                        {
                            hour:
                                "2-digit",

                            minute:
                                "2-digit"
                        }
                    );


                newNoteItem.innerHTML =
                    "<strong>" +
                    timeString +
                    ":</strong> " +
                    noteText;


                noteList.appendChild(
                    newNoteItem
                );


                noteInput.value =
                    "";

            }
        );

    }


    // Initial dashboard count
    updateCounts();

});

