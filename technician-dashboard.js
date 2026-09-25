// Technician Dashboard - Summary Card Filter & Quick Status Update

document.addEventListener('DOMContentLoaded', () => {
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
    const statusSelects = document.querySelectorAll('.quick-status-select');

    // Badge text for each filter/select value
    const statusLabels = {
        open: 'Open',
        progress: 'In Progress',
        resolved: 'Resolved'
    };

    // Banner text matches the summary card titles
    const bannerLabels = {
        open: 'Open',
        progress: 'In Progress',
        resolved: 'Resolved Today'
    };

    let currentFilter = 'all';

    function getStatusText(row) {
        const badge = row.querySelector('.status');
        return badge ? badge.textContent.trim().toLowerCase() : '';
    }

    function updateCounts() {
        let openCount = 0;
        let progressCount = 0;
        let resolvedCount = 0;

        ticketRows.forEach((row) => {
            const statusText = getStatusText(row);
            if (statusText === 'open') {
                openCount++;
            } else if (statusText === 'in progress') {
                progressCount++;
            } else if (statusText === 'resolved') {
                resolvedCount++;
            }
        });

        if (countAssigned) {
            countAssigned.textContent = ticketRows.length;
        }
        if (countOpen) {
            countOpen.textContent = openCount;
        }
        if (countProgress) {
            countProgress.textContent = progressCount;
        }
        if (countResolved) {
            countResolved.textContent = resolvedCount;
        }
    }

    function filterTableByStatus(targetStatus) {
        currentFilter = targetStatus;
        let visibleCount = 0;

        ticketRows.forEach((row) => {
            const isMatch = targetStatus === 'all' ||
                getStatusText(row) === statusLabels[targetStatus].toLowerCase();

            row.hidden = !isMatch;
            if (isMatch) {
                visibleCount++;
            }
        });

        if (!filterBanner) {
            return;
        }

        if (targetStatus === 'all') {
            filterBanner.hidden = true;
        } else {
            const plural = visibleCount === 1 ? '' : 's';
            filterBannerText.textContent = `Filtered by: ${bannerLabels[targetStatus]} (${visibleCount} ticket${plural})`;
            filterBanner.hidden = false;
        }
    }

    summaryCards.forEach((card) => {
        card.addEventListener('click', () => {
            const filterType = card.dataset.filter;
            if (filterType) {
                filterTableByStatus(filterType);
            }
        });
    });

    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', () => {
            filterTableByStatus('all');
        });
    }

    statusSelects.forEach((select) => {
        select.addEventListener('change', () => {
            const newStatus = select.value;
            const badge = select.closest('tr').querySelector('.status');

            if (badge && statusLabels[newStatus]) {
                badge.textContent = statusLabels[newStatus];
                badge.className = `status ${newStatus}`;
            }

            updateCounts();

            // Re-apply the active card filter, so a row whose new status
            // no longer matches is hidden straight away
            if (currentFilter !== 'all') {
                filterTableByStatus(currentFilter);
            }
        });
    });

    updateCounts();
});
