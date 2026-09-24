// Admin Dashboard - Recent Activity Filter

document.addEventListener('DOMContentLoaded', function () {
    var activityFilterBtns = document.querySelectorAll('.activity-filter-btn');
    var activityItems = document.querySelectorAll('.activity-list .activity-item');
    var activityCountText = document.getElementById('activity-filter-count');

    activityFilterBtns.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            var filterType = e.target.getAttribute('data-type');
            var visibleCount = 0;

            // Highlight selected filter chip
            activityFilterBtns.forEach(function (b) {
                b.style.backgroundColor = 'var(--card-bg)';
                b.style.color = 'var(--text-dark)';
            });
            e.target.style.backgroundColor = 'var(--sidebar-active)';
            e.target.style.color = '#FFFFFF';

            for (var j = 0; j < activityItems.length; j++) {
                var item = activityItems[j];
                var itemType = item.getAttribute('data-type');
                if (filterType === 'all' || itemType === filterType) {
                    item.style.display = 'flex';
                    visibleCount++;
                } else {
                    item.style.display = 'none';
                }
            }

            if (activityCountText) {
                activityCountText.textContent = 'Showing ' + visibleCount + ' of ' + activityItems.length + ' activities';
            }
        });
    });
});
