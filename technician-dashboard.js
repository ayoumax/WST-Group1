// ==========================================================================
// MotorPH IT Support - Technician Dashboard Interactivity (Week 4)
// ==========================================================================

document.addEventListener('DOMContentLoaded', function () {

    // 1. LOCATE WEBPAGE ELEMENTS
    var summaryCards = document.querySelectorAll('.summary-grid .summary-card');
    var countAssigned = document.getElementById('count-assigned');
    var countOpen = document.getElementById('count-open');
    var countProgress = document.getElementById('count-progress');
    var countResolved = document.getElementById('count-resolved');

    var filterBanner = document.getElementById('technician-filter-banner');
    var filterBannerText = document.getElementById('technician-filter-text');
    var resetFilterBtn = document.getElementById('technician-reset-filter');
    var updateToast = document.getElementById('technician-update-toast');

    var tableBody = document.querySelector('.recent-tickets tbody');
    var ticketRows = tableBody ? tableBody.querySelectorAll('tr') : [];

    // Note section elements
    var noteInput = document.getElementById('shift-note-input');
    var saveNoteBtn = document.getElementById('save-note-btn');
    var noteList = document.getElementById('technician-notes-list');

    var currentFilter = 'all';

    // 2. FUNCTION TO RECALCULATE & UPDATE SUMMARY COUNTS
    function updateCounts() {
        var openCount = 0;
        var progressCount = 0;
        var resolvedCount = 0;
        var totalCount = ticketRows.length;

        for (var i = 0; i < ticketRows.length; i++) {
            var statusBadge = ticketRows[i].querySelector('.status');
            if (statusBadge) {
                var text = statusBadge.textContent.trim().toLowerCase();
                if (text === 'open') {
                    openCount++;
                } else if (text === 'in progress') {
                    progressCount++;
                } else if (text === 'resolved') {
                    resolvedCount++;
                }
            }
        }

        // UPDATE WEBPAGE CONTENT
        if (countAssigned) countAssigned.textContent = totalCount;
        if (countOpen) countOpen.textContent = openCount;
        if (countProgress) countProgress.textContent = progressCount;
        if (countResolved) countResolved.textContent = resolvedCount;
    }

    // 3. FUNCTION TO FILTER TABLE ROWS BY STATUS
    function filterTableByStatus(targetStatus) {
        currentFilter = targetStatus;
        var visibleCount = 0;

        for (var i = 0; i < ticketRows.length; i++) {
            var row = ticketRows[i];
            var statusBadge = row.querySelector('.status');
            var statusText = statusBadge ? statusBadge.textContent.trim().toLowerCase() : '';

            // EVALUATE CONDITIONS
            var matches = false;
            if (targetStatus === 'all') {
                matches = true;
            } else if (targetStatus === 'open' && statusText === 'open') {
                matches = true;
            } else if (targetStatus === 'progress' && statusText === 'in progress') {
                matches = true;
            } else if (targetStatus === 'resolved' && statusText === 'resolved') {
                matches = true;
            }

            // DISPLAY DIFFERENT RESULTS
            if (matches) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        }

        // Display or hide the active filter banner
        if (filterBanner) {
            if (targetStatus === 'all') {
                filterBanner.style.display = 'none';
            } else {
                filterBanner.style.display = 'flex';
                var labelMap = {
                    'open': 'Open',
                    'progress': 'In Progress',
                    'resolved': 'Resolved Today'
                };
                var displayLabel = labelMap[targetStatus] || targetStatus;
                filterBannerText.textContent = 'Filtered by: ' + displayLabel + ' (' + visibleCount + ' ticket' + (visibleCount === 1 ? '' : 's') + ')';
            }
        }
    }

    // 4. RESPOND TO SUMMARY CARD CLICKS
    for (var c = 0; c < summaryCards.length; c++) {
        (function (card) {
            // Style pointer cursor to indicate clickability
            card.style.cursor = 'pointer';

            card.addEventListener('click', function () {
                var filterType = card.getAttribute('data-filter');
                if (filterType) {
                    filterTableByStatus(filterType);
                }
            });
        })(summaryCards[c]);
    }

    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', function (e) {
            e.preventDefault();
            filterTableByStatus('all');
        });
    }

    // 5. RESPOND TO QUICK STATUS SELECT DROPDOWNS
    var statusSelects = document.querySelectorAll('.quick-status-select');
    for (var s = 0; s < statusSelects.length; s++) {
        statusSelects[s].addEventListener('change', function (event) {
            // ACCEPT USER INPUT
            var newStatus = event.target.value;
            var row = event.target.closest('tr');
            var ticketIdLink = row.querySelector('.ticket-link');
            var ticketId = ticketIdLink ? ticketIdLink.textContent.trim() : 'Ticket';
            var statusBadge = row.querySelector('.status');

            // EVALUATE CONDITIONS & UPDATE WEBPAGE CONTENT
            if (newStatus === 'open') {
                statusBadge.textContent = 'Open';
                statusBadge.className = 'status open';
            } else if (newStatus === 'progress') {
                statusBadge.textContent = 'In Progress';
                statusBadge.className = 'status progress';
            } else if (newStatus === 'resolved') {
                statusBadge.textContent = 'Resolved';
                statusBadge.className = 'status resolved';
            }

            // Recalculate summary cards
            updateCounts();

            // Re-apply current table filter if active
            if (currentFilter !== 'all') {
                filterTableByStatus(currentFilter);
            }

            // Show toast/notification message
            if (updateToast) {
                var statusNames = {
                    'open': 'Open',
                    'progress': 'In Progress',
                    'resolved': 'Resolved'
                };
                updateToast.textContent = ticketId + ' status updated to ' + (statusNames[newStatus] || newStatus) + '.';
                updateToast.style.display = 'block';

                // Automatically hide toast after 3 seconds
                setTimeout(function () {
                    updateToast.style.display = 'none';
                }, 3000);
            }
        });
    }

    // 6. TECHNICIAN SHIFT NOTE LOGGER (User input & conditional list append)
    if (saveNoteBtn && noteInput && noteList) {
        saveNoteBtn.addEventListener('click', function () {
            // ACCEPT USER INPUT
            var noteText = noteInput.value.trim();

            // EVALUATE CONDITIONS
            if (noteText === '') {
                alert('Please enter a note before saving.');
                return;
            }

            // UPDATE WEBPAGE CONTENT
            var newNoteItem = document.createElement('li');
            var now = new Date();
            var timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            newNoteItem.innerHTML = '<strong>' + timeString + ':</strong> ' + noteText;
            noteList.appendChild(newNoteItem);

            // Reset input
            noteInput.value = '';
        });
    }

    // Initial count calculation
    updateCounts();

});
