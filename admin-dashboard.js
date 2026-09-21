// ==========================================================================
// MotorPH IT Support - Admin Dashboard Interactivity (Week 4)
// ==========================================================================

document.addEventListener('DOMContentLoaded', function () {

    // 1. LOCATE WEBPAGE ELEMENTS
    // Metric detail elements
    var summaryCards = document.querySelectorAll('.admin-summary-cards .summary-card');
    var metricDetailBanner = document.getElementById('admin-metric-detail');
    var metricDetailText = document.getElementById('admin-metric-text');
    var clearMetricBtn = document.getElementById('admin-clear-metric');

    // Recent activity filter elements
    var activityFilterBtns = document.querySelectorAll('.activity-filter-btn');
    var activityItems = document.querySelectorAll('.activity-list .activity-item');
    var activityCountText = document.getElementById('activity-filter-count');

    // Broadcast announcement elements
    var noticeInput = document.getElementById('system-notice-input');
    var noticeTypeSelect = document.getElementById('system-notice-type');
    var postNoticeBtn = document.getElementById('post-notice-btn');
    var announcementContainer = document.getElementById('admin-announcement-container');

    // 2. METRIC DETAILS ON CARD CLICK
    var metricDescriptions = {
        'total': 'Total Tickets (26): All support tickets registered across all departments.',
        'open': 'Open Tickets (5): Tickets awaiting initial technician assignment and response.',
        'progress': 'In Progress (3): Tickets currently undergoing active diagnosis or repair.',
        'resolved': 'Resolved Tickets (10): Tickets marked resolved and awaiting employee confirmation.',
        'unassigned': 'Unassigned Tickets (4): High-priority action required! 4 tickets need technician assignment.',
        'closed': 'Closed Tickets (8): Finished tickets verified and archived.'
    };

    for (var i = 0; i < summaryCards.length; i++) {
        (function (card) {
            card.style.cursor = 'pointer';

            card.addEventListener('click', function () {
                // ACCEPT USER INPUT / SELECTION
                var metricKey = card.getAttribute('data-metric');

                // EVALUATE CONDITIONS
                if (metricKey && metricDescriptions[metricKey]) {
                    // UPDATE WEBPAGE CONTENT
                    metricDetailText.textContent = metricDescriptions[metricKey];
                    metricDetailBanner.style.display = 'flex';

                    // Highlight card
                    for (var j = 0; j < summaryCards.length; j++) {
                        summaryCards[j].style.borderColor = 'var(--card-border)';
                    }
                    card.style.borderColor = 'var(--sidebar-active)';
                }
            });
        })(summaryCards[i]);
    }

    if (clearMetricBtn) {
        clearMetricBtn.addEventListener('click', function () {
            metricDetailBanner.style.display = 'none';
            for (var j = 0; j < summaryCards.length; j++) {
                summaryCards[j].style.borderColor = 'var(--card-border)';
            }
        });
    }

    // 3. RECENT ACTIVITY FILTERING
    for (var b = 0; b < activityFilterBtns.length; b++) {
        activityFilterBtns[b].addEventListener('click', function (event) {
            // ACCEPT USER INPUT
            var selectedType = event.target.getAttribute('data-type');
            var visibleCount = 0;

            // Update active button styling
            for (var k = 0; k < activityFilterBtns.length; k++) {
                activityFilterBtns[k].style.backgroundColor = 'var(--card-bg)';
                activityFilterBtns[k].style.color = 'var(--text-dark)';
            }
            event.target.style.backgroundColor = 'var(--sidebar-active)';
            event.target.style.color = '#FFFFFF';

            // EVALUATE CONDITIONS & DISPLAY DIFFERENT RESULTS
            for (var m = 0; m < activityItems.length; m++) {
                var item = activityItems[m];
                var itemType = item.getAttribute('data-type');

                if (selectedType === 'all' || itemType === selectedType) {
                    item.style.display = 'flex';
                    visibleCount++;
                } else {
                    item.style.display = 'none';
                }
            }

            // UPDATE WEBPAGE CONTENT
            if (activityCountText) {
                activityCountText.textContent = 'Showing ' + visibleCount + ' of ' + activityItems.length + ' activities';
            }
        });
    }

    // 4. BROADCAST ANNOUNCEMENT POSTING
    if (postNoticeBtn && noticeInput && noticeTypeSelect && announcementContainer) {
        postNoticeBtn.addEventListener('click', function () {
            // ACCEPT USER INPUT
            var message = noticeInput.value.trim();
            var noticeType = noticeTypeSelect.value;

            // EVALUATE CONDITIONS
            if (message === '') {
                alert('Please type an announcement message before posting.');
                return;
            }

            // Create announcement banner element
            var banner = document.createElement('div');
            banner.className = 'admin-live-banner';
            banner.style.padding = '12px 16px';
            banner.style.borderRadius = '8px';
            banner.style.marginBottom = '16px';
            banner.style.display = 'flex';
            banner.style.justifyContent = 'space-between';
            banner.style.alignItems = 'center';

            var now = new Date();
            var timeStamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            if (noticeType === 'urgent') {
                banner.style.backgroundColor = '#FDECEC';
                banner.style.border = '1px solid #FCA5A5';
                banner.style.color = '#991B1B';
                banner.innerHTML = '<div><strong>[URGENT ALERT - ' + timeStamp + ']:</strong> ' + message + '</div>';
            } else {
                banner.style.backgroundColor = '#E8F1FF';
                banner.style.border = '1px solid #B8D5FC';
                banner.style.color = '#0F52AA';
                banner.innerHTML = '<div><strong>[ANNOUNCEMENT - ' + timeStamp + ']:</strong> ' + message + '</div>';
            }

            // Add dismiss button
            var dismissBtn = document.createElement('button');
            dismissBtn.type = 'button';
            dismissBtn.textContent = '✕ Dismiss';
            dismissBtn.style.background = 'transparent';
            dismissBtn.style.border = 'none';
            dismissBtn.style.cursor = 'pointer';
            dismissBtn.style.fontWeight = 'bold';
            dismissBtn.style.marginLeft = '12px';
            dismissBtn.style.color = 'inherit';

            dismissBtn.addEventListener('click', function () {
                banner.remove();
            });

            banner.appendChild(dismissBtn);

            // UPDATE WEBPAGE CONTENT
            announcementContainer.prepend(banner);

            // Clear input
            noticeInput.value = '';
        });
    }

});
