// ==========================================================================
// MotorPH IT Support - Technician Dashboard Interactivity
// ==========================================================================

document.addEventListener("DOMContentLoaded", function () {

    // 1. LOCATE WEBPAGE ELEMENTS
    const summaryCards =
        document.querySelectorAll(
            ".summary-card"
        );

    const countAssigned =
        document.getElementById(
            "count-assigned"
        );

    const countOpen =
        document.getElementById(
            "count-open"
        );

    const countProgress =
        document.getElementById(
            "count-progress"
        );

    const countResolved =
        document.getElementById(
            "count-resolved"
        );

    const filterBanner =
        document.getElementById(
            "technician-filter-banner"
        );

    const filterBannerText =
        document.getElementById(
            "technician-filter-text"
        );

    const resetFilterBtn =
        document.getElementById(
            "technician-reset-filter"
        );

    const updateToast =
        document.getElementById(
            "technician-update-toast"
        );

    const tableBody =
        document.querySelector(
            ".recent-tickets tbody"
        );

    const noteInput =
        document.getElementById(
            "shift-note-input"
        );

    const saveNoteBtn =
        document.getElementById(
            "save-note-btn"
        );

    const noteList =
        document.getElementById(
            "technician-notes-list"
        );

    let currentFilter =
        "all";

    let toastTimer =
        null;


    // ======================================================================
    // HELPER: STATUS CSS CLASS
    // ======================================================================

    function getStatusClass(status) {

        if (status === "in-progress" || status === "progress") {

            return "progress";

        }

        if (status === "resolved") {

            return "resolved";

        }

        return "open";

    }


    // ======================================================================
    // HELPER: SHOW NOTIFICATION TOAST
    // ======================================================================

    function showToast(message) {

        if (!updateToast) {

            return;

        }


        if (toastTimer) {

            clearTimeout(toastTimer);

        }


        updateToast.textContent =
            message;

        updateToast.style.display =
            "block";


        toastTimer =
            setTimeout(function () {

                updateToast.style.display =
                    "none";

            }, 3000);

    }


    // ======================================================================
    // 2. UPDATE SUMMARY COUNTS
    // ======================================================================

    function updateCounts() {

        if (!tableBody) {

            return;

        }


        const rows =
            tableBody.querySelectorAll("tr");

        let openCount =
            0;

        let progressCount =
            0;

        let resolvedCount =
            0;

        let totalCount =
            0;


        for (let i = 0; i < rows.length; i++) {

            const statusBadge =
                rows[i].querySelector(".status");


            // Ignore placeholder / empty row
            if (!statusBadge) {

                continue;

            }


            totalCount++;

            const statusText =
                statusBadge.textContent.trim().toLowerCase();


            if (statusText === "open") {

                openCount++;

            } else if (statusText === "in progress") {

                progressCount++;

            } else if (statusText === "resolved") {

                resolvedCount++;

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


    // ======================================================================
    // 3. FILTER TABLE BY STATUS
    // ======================================================================

    function filterTableByStatus(filterType) {

        currentFilter =
            filterType;


        if (!tableBody) {

            return;

        }


        const rows =
            tableBody.querySelectorAll("tr");

        let visibleCount =
            0;


        for (let i = 0; i < rows.length; i++) {

            const statusBadge =
                rows[i].querySelector(".status");


            if (!statusBadge) {

                continue;

            }


            const statusText =
                statusBadge.textContent.trim().toLowerCase();

            let matches =
                false;


            if (filterType === "all") {

                matches =
                    true;

            } else if (filterType === "open" && statusText === "open") {

                matches =
                    true;

            } else if (filterType === "progress" && statusText === "in progress") {

                matches =
                    true;

            } else if (filterType === "resolved" && statusText === "resolved") {

                matches =
                    true;

            }


            if (matches) {

                rows[i].style.display =
                    "";

                visibleCount++;

            } else {

                rows[i].style.display =
                    "none";

            }

        }


        // Update filter banner
        if (filterBanner && filterBannerText) {

            if (filterType === "all") {

                filterBanner.style.display =
                    "none";

            } else {

                let label =
                    filterType;


                if (filterType === "progress") {

                    label =
                        "In Progress";

                } else if (filterType === "open") {

                    label =
                        "Open";

                } else if (filterType === "resolved") {

                    label =
                        "Resolved";

                }


                filterBanner.style.display =
                    "flex";

                filterBannerText.textContent =
                    "Filtered by: " +
                    label +
                    " (" +
                    visibleCount +
                    " ticket" +
                    (visibleCount === 1 ? "" : "s") +
                    ")";

            }

        }

    }


    // ======================================================================
    // 4. QUICK STATUS UPDATE VIA PATCH /tickets/:id
    // ======================================================================

    async function handleStatusChange(event) {

        const selectElement =
            event.target;

        const ticketId =
            selectElement.dataset.ticketId;

        const newStatus =
            selectElement.value;

        const oldStatus =
            selectElement.dataset.currentStatus || "open";


        try {

            const response =
                await fetch(
                    "/tickets/" +
                        encodeURIComponent(ticketId),
                    {
                        method:
                            "PATCH",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                status:
                                    newStatus
                            })
                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                alert(
                    result.message ||
                    "Failed to update ticket status."
                );

                selectElement.value =
                    oldStatus;

                return;

            }


            // Update current tracking value
            selectElement.dataset.currentStatus =
                newStatus;


            // Update the status badge in this row
            const row =
                selectElement.closest("tr");

            const statusBadge =
                row.querySelector(".status");


            if (statusBadge) {

                const badgeClass =
                    getStatusClass(result.ticket.status);

                statusBadge.className =
                    "status " +
                    badgeClass;

                statusBadge.textContent =
                    result.ticket.statusText ||
                    result.ticket.status;

            }


            // Display toast notification
            const displayTitle =
                result.ticket.statusText ||
                newStatus;

            showToast(
                "Status updated to " +
                displayTitle +
                " for ticket " +
                ticketId +
                "."
            );


            // Recalculate summary card counts
            updateCounts();


            // Re-apply active filter if one is active
            if (currentFilter !== "all") {

                filterTableByStatus(currentFilter);

            }

        } catch (error) {

            console.error(
                "Error updating status:",
                error
            );

            alert(
                "Network error while updating status. Please try again."
            );

            selectElement.value =
                oldStatus;

        }

    }


    // ======================================================================
    // 5. LOAD ASSIGNED TICKETS FROM BACKEND
    // ======================================================================

    async function loadAssignedTickets() {

        if (!tableBody) {

            return;

        }


        try {

            const response =
                await fetch("/tickets");


            if (!response.ok) {

                throw new Error(
                    "Unable to load assigned tickets."
                );

            }


            const data =
                await response.json();

            const tickets =
                data.tickets || [];


            tableBody.innerHTML =
                "";


            if (tickets.length === 0) {

                const emptyRow =
                    document.createElement("tr");

                emptyRow.innerHTML =
                    '<td colspan="6" style="text-align: center; padding: 24px; color: var(--text-muted); font-size: 13px;">No assigned tickets currently found.</td>';

                tableBody.appendChild(
                    emptyRow
                );

                updateCounts();

                return;

            }


            // Render ticket rows
            tickets.forEach(function (ticket) {

                const row =
                    document.createElement("tr");

                row.dataset.ticketId =
                    ticket.id;


                // 1. TICKET ID
                const idCell =
                    document.createElement("td");

                const ticketLink =
                    document.createElement("a");

                ticketLink.className =
                    "ticket-link";

                ticketLink.href =
                    "technician-ticket-detail.html?id=" +
                    encodeURIComponent(ticket.id);

                ticketLink.textContent =
                    ticket.id;

                idCell.appendChild(
                    ticketLink
                );


                // 2. EMPLOYEE
                const employeeCell =
                    document.createElement("td");

                employeeCell.textContent =
                    ticket.submittedBy ||
                    "Employee";


                // 3. ISSUE
                const issueCell =
                    document.createElement("td");

                issueCell.textContent =
                    ticket.subject;


                // 4. PRIORITY
                const priorityCell =
                    document.createElement("td");

                const priorityBadge =
                    document.createElement("span");

                const priorityClass =
                    (ticket.priority || "low").toLowerCase();

                priorityBadge.className =
                    "priority " +
                    priorityClass;

                priorityBadge.textContent =
                    ticket.priorityText ||
                    ticket.priority ||
                    "Low";

                priorityCell.appendChild(
                    priorityBadge
                );


                // 5. STATUS
                const statusCell =
                    document.createElement("td");

                const statusBadge =
                    document.createElement("span");

                const statusClass =
                    getStatusClass(ticket.status);

                statusBadge.className =
                    "status " +
                    statusClass;

                statusBadge.textContent =
                    ticket.statusText ||
                    ticket.status ||
                    "Open";

                statusCell.appendChild(
                    statusBadge
                );


                // 6. QUICK ACTION SELECT
                const actionCell =
                    document.createElement("td");

                const select =
                    document.createElement("select");

                select.className =
                    "quick-status-select";

                select.setAttribute(
                    "aria-label",
                    "Update ticket status"
                );

                select.style.padding =
                    "5px 8px";

                select.style.fontSize =
                    "12px";

                select.style.borderRadius =
                    "5px";

                select.style.border =
                    "1px solid var(--card-border)";

                select.dataset.ticketId =
                    ticket.id;


                select.innerHTML = `
                    <option value="open">Open</option>
                    <option value="progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                `;


                // Set selected value
                let selectedVal =
                    "open";


                if (
                    ticket.status === "in-progress" ||
                    ticket.status === "progress"
                ) {

                    selectedVal =
                        "progress";

                } else if (
                    ticket.status === "resolved"
                ) {

                    selectedVal =
                        "resolved";

                }


                select.value =
                    selectedVal;

                select.dataset.currentStatus =
                    selectedVal;


                select.addEventListener(
                    "change",
                    handleStatusChange
                );

                actionCell.appendChild(
                    select
                );


                // Append cells to row
                row.appendChild(idCell);
                row.appendChild(employeeCell);
                row.appendChild(issueCell);
                row.appendChild(priorityCell);
                row.appendChild(statusCell);
                row.appendChild(actionCell);

                tableBody.appendChild(row);

            });


            // Update card counters
            updateCounts();

        } catch (error) {

            console.error(
                "Error loading assigned tickets:",
                error
            );

        }

    }


    // Initial fetch of assigned tickets
    loadAssignedTickets();


    // ======================================================================
    // 6. SUMMARY CARD CLICK FILTERING
    // ======================================================================

    for (
        let c = 0;
        c < summaryCards.length;
        c++
    ) {

        (function (card) {

            card.style.cursor =
                "pointer";


            card.addEventListener(
                "click",
                function () {

                    const filterType =
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


    // ======================================================================
    // 7. SHIFT NOTES (LOCAL STORAGE PERSISTENCE)
    // ======================================================================

    const SHIFT_NOTES_KEY =
        "technicianShiftNotes";


    function getSavedNotes() {

        const saved =
            localStorage.getItem(
                SHIFT_NOTES_KEY
            );


        if (!saved) {

            return [];

        }


        try {

            return JSON.parse(saved);

        } catch {

            return [];

        }

    }


    function renderNotes() {

        if (!noteList) {

            return;

        }


        const notes =
            getSavedNotes();

        noteList.innerHTML =
            "";


        notes.forEach(function (noteText) {

            const li =
                document.createElement("li");

            li.textContent =
                noteText;

            li.style.marginBottom =
                "4px";

            noteList.appendChild(
                li
            );

        });

    }


    if (saveNoteBtn && noteInput) {

        saveNoteBtn.addEventListener(
            "click",
            function () {

                const text =
                    noteInput.value.trim();


                if (text === "") {

                    return;

                }


                const notes =
                    getSavedNotes();

                const now =
                    new Date();

                const timeStamp =
                    now.toLocaleTimeString(
                        [],
                        {
                            hour: "2-digit",
                            minute: "2-digit"
                        }
                    );


                notes.unshift(
                    "[" + timeStamp + "] " + text
                );


                localStorage.setItem(
                    SHIFT_NOTES_KEY,
                    JSON.stringify(notes)
                );

                noteInput.value =
                    "";

                renderNotes();

            }
        );

    }


    // Initial notes render
    renderNotes();

});
