// Admin Dashboard - Recent Activity Filter

document.addEventListener('DOMContentLoaded', () => {
    const activityFilterBtns = document.querySelectorAll('.activity-filter-btn');
    const activityItems = document.querySelectorAll('.activity-list .activity-item');
    const activityCountText = document.getElementById('activity-filter-count');

    activityFilterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const filterType = btn.dataset.type;
            let visibleCount = 0;

            activityFilterBtns.forEach((b) => b.classList.remove('is-active'));
            btn.classList.add('is-active');

            activityItems.forEach((item) => {
                const matches = filterType === 'all' || item.dataset.type === filterType;
                item.hidden = !matches;
                if (matches) {
                    visibleCount++;
                }
            });

            if (activityCountText) {
                activityCountText.textContent = `Showing ${visibleCount} of ${activityItems.length} activities`;
            }
        });
    });
});
