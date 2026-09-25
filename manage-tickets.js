// MotorPH IT Support - Manage Tickets Filter Logic

document.addEventListener('DOMContentLoaded', () => {
    const filterForm = document.querySelector('.filter-form');
    const searchInput = document.getElementById('staff-search');
    const statusSelect = document.getElementById('staff-status');
    const filterResetBtn = document.getElementById('filter-reset-btn');
    const filterFeedback = document.getElementById('filter-feedback');
    const tableBody = document.querySelector('.table-container tbody');
    const ticketRows = tableBody.querySelectorAll('tr');

    const totalTickets = ticketRows.length;

    function applyFilter() {
        const query = searchInput.value.toLowerCase().trim();
        const selectedStatus = statusSelect.value.toLowerCase().trim();
        let visibleCount = 0;

        ticketRows.forEach(row => {
            const ticketId = row.cells[0].textContent.toLowerCase();
            const employee = row.cells[1].textContent.toLowerCase();
            const category = row.cells[2].textContent.toLowerCase();
            const priority = row.cells[3].textContent.toLowerCase();
            const statusBadge = row.cells[4].querySelector('.status');
            const statusText = statusBadge ? statusBadge.textContent.toLowerCase().trim() : '';

            // Match query across ID, employee name, category or priority
            const matchesSearch = query === '' ||
                ticketId.includes(query) ||
                employee.includes(query) ||
                category.includes(query) ||
                priority.includes(query);

            // Note: select value uses hyphen ('in-progress') while badge text is 'in progress'
            let matchesStatus = false;
            if (selectedStatus === 'all') {
                matchesStatus = true;
            } else if (selectedStatus === 'in-progress' && statusText === 'in progress') {
                matchesStatus = true;
            } else if (selectedStatus === statusText) {
                matchesStatus = true;
            }

            const isMatch = matchesSearch && matchesStatus;
            row.hidden = !isMatch;
            if (isMatch) {
                visibleCount++;
            }
        });

        // Update feedback counter label below form
        if (filterFeedback) {
            if (visibleCount === 0) {
                filterFeedback.textContent = 'No tickets match your search criteria. Try a different keyword or status.';
                filterFeedback.style.color = '#B91C1C';
            } else if (visibleCount === totalTickets) {
                filterFeedback.textContent = `Showing all ${totalTickets} tickets.`;
                filterFeedback.style.color = 'var(--text-muted)';
            } else {
                filterFeedback.textContent = `Showing ${visibleCount} of ${totalTickets} tickets.`;
                filterFeedback.style.color = 'var(--text-muted)';
            }
        }

        console.log('Filtered tickets count:', visibleCount);
    }

    if (filterForm) {
        filterForm.addEventListener('submit', e => {
            e.preventDefault();
            applyFilter();
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', applyFilter);
    }

    if (statusSelect) {
        statusSelect.addEventListener('change', applyFilter);
    }

    if (filterResetBtn) {
        filterResetBtn.addEventListener('click', () => {
            searchInput.value = '';
            statusSelect.value = 'all';
            applyFilter();
        });
    }
});
