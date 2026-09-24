// Technician Dashboard - Summary Card Filter & Quick Status Update

document.addEventListener('DOMContentLoaded', function () {
    const summaryCards = document.querySelectorAll('.summary-grid .summary-card');
    const countAssigned = document.getElementById('count-assigned');
    const countOpen = document.getElementById('count-open');
    const countProgress = document.getElementById('count-progress');
    const countResolved = document.getElementById('count-resolved');

    const filterBanner = document.getElementById('technician-filter-banner');
    const filterBannerText = document.getElementById('technician-filter-text');
    const resetFilterBtn = document.getElementById('technician-reset-filter');

    const tableBody = document.querySelector('.recent-tickets tbody');
    const ticketRows = tableBody ? tableBody.querySelectorAll('tr') : [];

    let currentFilter = 'all';

    // Recount status badges across the assigned table
    function updateCounts() {
        let openCount = 0;
        let progressCount = 0;
        let resolvedCount = 0;
        const totalCount = ticketRows.length;

        for (const row of ticketRows) {
            const badge = row.querySelector('.status');
            if (badge) {
                const text = badge.textContent.trim().toLowerCase();
                if (text === 'open') openCount++;
                else if (text === 'in progress') progressCount++;
                else if (text === 'resolved') resolvedCount++;
            }
        }

        if (countAssigned) countAssigned.textContent = totalCount;
        if (countOpen) countOpen.textContent = openCount;
        if (countProgress) countProgress.textContent = progressCount;
        if (countResolved) countResolved.textContent = resolvedCount;
    }

    // Filter table rows when clicking a summary card
    function filterTableByStatus(targetStatus) {
        currentFilter = targetStatus;
        let visibleCount = 0;

        for (const row of ticketRows) {
            const badge = row.querySelector('.status');
            const statusText = badge ? badge.textContent.trim().toLowerCase() : '';

            let isMatch = false;
            if (targetStatus === 'all') {
                isMatch = true;
            } else if (targetStatus === 'open' && statusText === 'open') {
                isMatch = true;
            } else if (targetStatus === 'progress' && statusText === 'in progress') {
                isMatch = true;
            } else if (targetStatus === 'resolved' && statusText === 'resolved') {
                isMatch = true;
            }

            if (isMatch) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        }

        if (filterBanner) {
            if (targetStatus === 'all') {
                filterBanner.style.display = 'none';
            } else {
                filterBanner.style.display = 'flex';
                const labelMap = {
                    open: 'Open',
                    progress: 'In Progress',
                    resolved: 'Resolved Today'
                };
                const displayLabel = labelMap[targetStatus] || targetStatus;
                filterBannerText.textContent = `Filtered by: ${displayLabel} (${visibleCount} ticket${visibleCount === 1 ? '' : 's'})`;
            }
        }
    }

    // Summary card click listeners
    summaryCards.forEach(function (card) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function () {
            const filterType = card.getAttribute('data-filter');
            if (filterType) filterTableByStatus(filterType);
        });
    });

    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', function (e) {
            e.preventDefault();
            filterTableByStatus('all');
        });
    }

    // Quick status dropdowns per ticket row
    const statusSelects = document.querySelectorAll('.quick-status-select');
    statusSelects.forEach(function (select) {
        select.addEventListener('change', function (event) {
            const newStatus = event.target.value;
            const row = event.target.closest('tr');
            const badge = row.querySelector('.status');

            if (newStatus === 'open') {
                badge.textContent = 'Open';
                badge.className = 'status open';
            } else if (newStatus === 'progress') {
                badge.textContent = 'In Progress';
                badge.className = 'status progress';
            } else if (newStatus === 'resolved') {
                badge.textContent = 'Resolved';
                badge.className = 'status resolved';
            }

            updateCounts();

            // Re-apply current card filter if active
            if (currentFilter !== 'all') {
                filterTableByStatus(currentFilter);
            }
        });
    });

    // Calculate initial counts on page load
    updateCounts();
});
