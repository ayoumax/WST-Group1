// ==========================================================================
// MotorPH IT Support - Manage / Assigned Tickets Interactivity (Week 4)
// ==========================================================================

// Run once the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', function () {

    // 1. LOCATE WEBPAGE ELEMENTS
    var filterForm = document.querySelector('.filter-form');
    var searchInput = document.getElementById('staff-search');
    var statusSelect = document.getElementById('staff-status');
    var filterSubmitBtn = document.getElementById('filter-submit-btn');
    var filterResetBtn = document.getElementById('filter-reset-btn');
    var filterFeedback = document.getElementById('filter-feedback');
    var tableBody = document.querySelector('.table-container tbody');
    var ticketRows = tableBody.querySelectorAll('tr');

    var totalTickets = ticketRows.length;

    // 2. FUNCTION TO APPLY SEARCH AND STATUS FILTERS
    function filterTickets() {
        // ACCEPT USER INPUT
        var searchText = searchInput.value.toLowerCase().trim();
        var selectedStatus = statusSelect.value.toLowerCase().trim();
        var visibleCount = 0;

        // Loop through each ticket row
        for (var i = 0; i < ticketRows.length; i++) {
            var row = ticketRows[i];

            // Locate specific cell elements inside this row
            var ticketId = row.cells[0].textContent.toLowerCase();
            var employee = row.cells[1].textContent.toLowerCase();
            var category = row.cells[2].textContent.toLowerCase();
            var priority = row.cells[3].textContent.toLowerCase();
            var statusElement = row.cells[4].querySelector('.status');
            var statusText = statusElement ? statusElement.textContent.toLowerCase().trim() : '';

            // EVALUATE CONDITIONS
            // Check if search matches Ticket ID, Employee, Category, or Priority
            var matchesSearch = searchText === '' ||
                ticketId.includes(searchText) ||
                employee.includes(searchText) ||
                category.includes(searchText) ||
                priority.includes(searchText);

            // Check if status dropdown matches
            var matchesStatus = false;
            if (selectedStatus === 'all') {
                matchesStatus = true;
            } else if (selectedStatus === 'in-progress' && statusText === 'in progress') {
                matchesStatus = true;
            } else if (selectedStatus === statusText) {
                matchesStatus = true;
            }

            // DISPLAY DIFFERENT RESULTS BASED ON CONDITIONS
            if (matchesSearch && matchesStatus) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        }

        // UPDATE WEBPAGE CONTENT (Feedback message)
        if (filterFeedback) {
            if (visibleCount === 0) {
                filterFeedback.textContent = 'No tickets match your search criteria. Try a different keyword or status.';
                filterFeedback.style.color = '#B91C1C'; // Warning/red tint
            } else if (visibleCount === totalTickets) {
                filterFeedback.textContent = 'Showing all ' + totalTickets + ' tickets.';
                filterFeedback.style.color = 'var(--text-muted)';
            } else {
                filterFeedback.textContent = 'Showing ' + visibleCount + ' of ' + totalTickets + ' tickets.';
                filterFeedback.style.color = 'var(--text-muted)';
            }
        }
    }

    // 3. RESPOND TO BUTTON CLICKS & USER INPUT
    if (filterForm) {
        // Handle form submission (click Filter button or press Enter)
        filterForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent page reload
            filterTickets();
        });
    }

    if (searchInput) {
        // Also respond dynamically while typing
        searchInput.addEventListener('input', function () {
            filterTickets();
        });
    }

    if (statusSelect) {
        // Respond when status dropdown changes
        statusSelect.addEventListener('change', function () {
            filterTickets();
        });
    }

    if (filterResetBtn) {
        // Reset button clears search, resets dropdown, and restores rows
        filterResetBtn.addEventListener('click', function () {
            searchInput.value = '';
            statusSelect.value = 'all';
            filterTickets();
        });
    }

});
