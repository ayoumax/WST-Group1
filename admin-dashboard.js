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
                b.classList.remove('is-active');
            });
            e.target.classList.add('is-active');

            for (var j = 0; j < activityItems.length; j++) {
                var item = activityItems[j];
                var itemType = item.getAttribute('data-type');
                if (filterType === 'all' || itemType === filterType) {
                    item.hidden = false;
                    visibleCount++;
                } else {
                    item.hidden = true;
                }
            }

            if (activityCountText) {
                activityCountText.textContent = 'Showing ' + visibleCount + ' of ' + activityItems.length + ' activities';
            }
        });
    });
});
