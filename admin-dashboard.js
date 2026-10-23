// ==========================================================================
// MotorPH IT Support - Admin Dashboard Interactivity
// ==========================================================================

document.addEventListener("DOMContentLoaded", function () {

    // 1. LOCATE WEBPAGE ELEMENTS
    // Metric detail elements
    const summaryCards =
        document.querySelectorAll(
            ".admin-summary-cards .summary-card"
        );

    const metricDetailBanner =
        document.getElementById(
            "admin-metric-detail"
        );

    const metricDetailText =
        document.getElementById(
            "admin-metric-text"
        );

    const clearMetricBtn =
        document.getElementById(
            "admin-clear-metric"
        );


    // Recent activity filter elements
    const activityFilterBtns =
        document.querySelectorAll(
            ".activity-filter-btn"
        );

    const activityItems =
        document.querySelectorAll(
            ".activity-list .activity-item"
        );

    const activityCountText =
        document.getElementById(
            "activity-filter-count"
        );


    // Broadcast announcement elements
    const noticeInput =
        document.getElementById(
            "system-notice-input"
        );

    const noticeTypeSelect =
        document.getElementById(
            "system-notice-type"
        );

    const postNoticeBtn =
        document.getElementById(
            "post-notice-btn"
        );

    const announcementContainer =
        document.getElementById(
            "admin-announcement-container"
        );


    // Dynamic descriptions updated by live stats
    const metricDescriptions = {
        total: "Total Tickets: All support tickets registered across all departments.",
        open: "Open Tickets: Tickets awaiting technician assignment and response.",
        progress: "In Progress: Tickets currently undergoing active diagnosis or repair.",
        resolved: "Resolved Tickets: Tickets marked resolved and awaiting employee confirmation.",
        unassigned: "Unassigned Tickets: High-priority action required! Tickets need technician assignment.",
        closed: "Closed Tickets: Finished tickets verified and archived."
    };


    // ======================================================================
    // 2. LOAD LIVE METRICS FROM BACKEND
    // ======================================================================

    function updateCardCount(metricKey, count) {

        const card =
            document.querySelector(
                `.admin-summary-cards .summary-card[data-metric="${metricKey}"] strong`
            );


        if (card) {

            card.textContent =
                count;

        }

    }


    async function loadAdminStats() {

        try {

            const response =
                await fetch("/tickets/stats");


            if (!response.ok) {

                throw new Error(
                    "Unable to load ticket statistics."
                );

            }


            const stats =
                await response.json();


            // Update number in each summary card
            updateCardCount(
                "total",
                stats.total ?? 0
            );

            updateCardCount(
                "open",
                stats.open ?? 0
            );

            updateCardCount(
                "progress",
                stats.inProgress ?? stats.progress ?? 0
            );

            updateCardCount(
                "resolved",
                stats.resolved ?? 0
            );

            updateCardCount(
                "unassigned",
                stats.unassigned ?? 0
            );

            updateCardCount(
                "closed",
                stats.closed ?? 0
            );


            // Update dynamic click descriptions
            metricDescriptions.total =
                `Total Tickets (${stats.total}): All support tickets registered across all departments.`;

            metricDescriptions.open =
                `Open Tickets (${stats.open}): Tickets awaiting technician assignment and response.`;

            metricDescriptions.progress =
                `In Progress (${stats.inProgress ?? stats.progress}): Tickets currently undergoing active diagnosis or repair.`;

            metricDescriptions.resolved =
                `Resolved Tickets (${stats.resolved}): Tickets marked resolved and awaiting employee confirmation.`;

            metricDescriptions.unassigned =
                `Unassigned Tickets (${stats.unassigned}): Action required! ${stats.unassigned} ticket(s) need technician assignment.`;

            metricDescriptions.closed =
                `Closed Tickets (${stats.closed}): Finished tickets verified and archived.`;

        } catch (error) {

            console.error(
                "Error loading admin stats:",
                error
            );

        }

    }


    // Load stats immediately on page load
    loadAdminStats();


    // ======================================================================
    // 3. METRIC DETAILS ON CARD CLICK
    // ======================================================================

    for (
        let i = 0;
        i < summaryCards.length;
        i++
    ) {

        (function (card) {

            card.style.cursor =
                "pointer";


            card.addEventListener(
                "click",
                function () {

                    const metricKey =
                        card.getAttribute(
                            "data-metric"
                        );


                    if (
                        metricKey &&
                        metricDescriptions[metricKey]
                    ) {

                        metricDetailText.textContent =
                            metricDescriptions[metricKey];

                        metricDetailBanner.style.display =
                            "flex";


                        // Highlight active card
                        for (
                            let j = 0;
                            j < summaryCards.length;
                            j++
                        ) {

                            summaryCards[j].style.borderColor =
                                "var(--card-border)";

                        }

                        card.style.borderColor =
                            "var(--sidebar-active)";

                    }

                }
            );

        })(summaryCards[i]);

    }


    if (clearMetricBtn) {

        clearMetricBtn.addEventListener(
            "click",
            function () {

                metricDetailBanner.style.display =
                    "none";

                for (
                    let j = 0;
                    j < summaryCards.length;
                    j++
                ) {

                    summaryCards[j].style.borderColor =
                        "var(--card-border)";

                }

            }
        );

    }


    // ======================================================================
    // 4. RECENT ACTIVITY FILTERING
    // ======================================================================

    for (
        let b = 0;
        b < activityFilterBtns.length;
        b++
    ) {

        activityFilterBtns[b].addEventListener(
            "click",
            function (event) {

                const selectedType =
                    event.target.getAttribute(
                        "data-type"
                    );

                let visibleCount =
                    0;


                // Update active button styling
                for (
                    let k = 0;
                    k < activityFilterBtns.length;
                    k++
                ) {

                    activityFilterBtns[k].style.backgroundColor =
                        "var(--card-bg)";

                    activityFilterBtns[k].style.color =
                        "var(--text-dark)";

                }

                event.target.style.backgroundColor =
                    "var(--sidebar-active)";

                event.target.style.color =
                    "#FFFFFF";


                // Show/hide activity items based on filter
                for (
                    let m = 0;
                    m < activityItems.length;
                    m++
                ) {

                    const item =
                        activityItems[m];

                    const itemType =
                        item.getAttribute(
                            "data-type"
                        );


                    if (
                        selectedType === "all" ||
                        itemType === selectedType
                    ) {

                        item.style.display =
                            "flex";

                        visibleCount++;

                    } else {

                        item.style.display =
                            "none";

                    }

                }


                if (activityCountText) {

                    activityCountText.textContent =
                        "Showing " +
                        visibleCount +
                        " of " +
                        activityItems.length +
                        " activities";

                }

            }
        );

    }


    // ======================================================================
    // 5. BROADCAST ANNOUNCEMENT POSTING
    // ======================================================================

    if (
        postNoticeBtn &&
        noticeInput &&
        noticeTypeSelect &&
        announcementContainer
    ) {

        postNoticeBtn.addEventListener(
            "click",
            function () {

                const message =
                    noticeInput.value.trim();

                const noticeType =
                    noticeTypeSelect.value;


                if (message === "") {

                    alert(
                        "Please type an announcement message before posting."
                    );

                    return;

                }


                const banner =
                    document.createElement(
                        "div"
                    );

                banner.className =
                    "admin-live-banner";

                banner.style.padding =
                    "12px 16px";

                banner.style.borderRadius =
                    "8px";

                banner.style.marginBottom =
                    "16px";

                banner.style.display =
                    "flex";

                banner.style.justifyContent =
                    "space-between";

                banner.style.alignItems =
                    "center";


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


                if (noticeType === "urgent") {

                    banner.style.backgroundColor =
                        "#FDECEC";

                    banner.style.border =
                        "1px solid #FCA5A5";

                    banner.style.color =
                        "#991B1B";

                    banner.innerHTML =
                        "<div><strong>[URGENT ALERT - " +
                        timeStamp +
                        "]:</strong> " +
                        message +
                        "</div>";

                } else {

                    banner.style.backgroundColor =
                        "#E8F1FF";

                    banner.style.border =
                        "1px solid #B8D5FC";

                    banner.style.color =
                        "#0F52AA";

                    banner.innerHTML =
                        "<div><strong>[ANNOUNCEMENT - " +
                        timeStamp +
                        "]:</strong> " +
                        message +
                        "</div>";

                }


                const dismissBtn =
                    document.createElement(
                        "button"
                    );

                dismissBtn.type =
                    "button";

                dismissBtn.textContent =
                    "✕ Dismiss";

                dismissBtn.style.background =
                    "transparent";

                dismissBtn.style.border =
                    "none";

                dismissBtn.style.cursor =
                    "pointer";

                dismissBtn.style.fontWeight =
                    "bold";

                dismissBtn.style.marginLeft =
                    "12px";

                dismissBtn.style.color =
                    "inherit";


                dismissBtn.addEventListener(
                    "click",
                    function () {

                        banner.remove();

                    }
                );


                banner.appendChild(
                    dismissBtn
                );

                announcementContainer.prepend(
                    banner
                );

                noticeInput.value =
                    "";

            }
        );

    }

});
