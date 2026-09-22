console.log("MotorPH JavaScript connected successfully.");


// =========================================================
// SUBMIT TICKET PAGE
// =========================================================

const ticketForm = document.getElementById("ticketForm");

if (ticketForm) {

    const subjectInput = document.getElementById("subject");
    const categoryInput = document.getElementById("category");
    const priorityInput = document.getElementById("priority");
    const departmentInput = document.getElementById("department");
    const deviceInput = document.getElementById("device");
    const descriptionInput = document.getElementById("description");

    const ticketFeedback = document.getElementById("ticketFeedback");
    const feedbackTitle = document.getElementById("feedbackTitle");
    const feedbackMessage = document.getElementById("feedbackMessage");

    const submittedSubject = document.getElementById("submittedSubject");
    const submittedCategory = document.getElementById("submittedCategory");
    const submittedPriority = document.getElementById("submittedPriority");
    const submittedDepartment = document.getElementById("submittedDepartment");
    const submittedDevice = document.getElementById("submittedDevice");


    ticketForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const subject = subjectInput.value.trim();
        const category = categoryInput.value;
        const priority = priorityInput.value;
        const department = departmentInput.value.trim();
        const device = deviceInput.value.trim();
        const description = descriptionInput.value.trim();


        // Check required information
        if (
            subject === "" ||
            category === "" ||
            description === ""
        ) {

            feedbackTitle.textContent =
                "Unable to Submit Ticket";

            feedbackMessage.textContent =
                "Please complete the Subject, Category, and Problem Description fields.";

            ticketFeedback.className =
                "ticket-feedback error";

            ticketFeedback.hidden = false;

            return;
        }


        const categoryText =
            categoryInput.options[
                categoryInput.selectedIndex
            ].text;

        const priorityText =
            priorityInput.options[
                priorityInput.selectedIndex
            ].text;


        // Different message depending on priority
        if (priority === "urgent") {

            feedbackTitle.textContent =
                "Urgent Ticket Submitted";

            feedbackMessage.textContent =
                "Your urgent request has been received and will be prioritized by the IT Support team.";

        } else if (priority === "high") {

            feedbackTitle.textContent =
                "High Priority Ticket Submitted";

            feedbackMessage.textContent =
                "Your high-priority request has been received and will be reviewed as soon as possible.";

        } else {

            feedbackTitle.textContent =
                "Ticket Submitted Successfully";

            feedbackMessage.textContent =
                "Your support request has been received. The IT Support team will review your ticket.";

        }


        // Display information entered by the user
        submittedSubject.textContent =
            subject;

        submittedCategory.textContent =
            categoryText;

        submittedPriority.textContent =
            priorityText;


        if (department === "") {

            submittedDepartment.textContent =
                "Not provided";

        } else {

            submittedDepartment.textContent =
                department;

        }


        if (device === "") {

            submittedDevice.textContent =
                "Not provided";

        } else {

            submittedDevice.textContent =
                device;

        }


        ticketFeedback.className =
            "ticket-feedback success";

        ticketFeedback.hidden = false;


        ticketFeedback.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

    });


    ticketForm.addEventListener("reset", function () {

        ticketFeedback.hidden = true;

    });

}


// =========================================================
// MY TICKETS SEARCH AND FILTER
// =========================================================

const ticketFilterForm =
    document.getElementById("ticketFilterForm");


if (ticketFilterForm) {

    const ticketSearch =
        document.getElementById("ticket-search");

    const statusFilter =
        document.getElementById("status-filter");

    const clearFilters =
        document.getElementById("clearFilters");

    const ticketRows =
        document.querySelectorAll(".ticket-row");

    const filterResult =
        document.getElementById("filterResult");

    const noTicketsMessage =
        document.getElementById("noTicketsMessage");


    // Filter tickets
    ticketFilterForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const searchText =
                ticketSearch.value
                    .trim()
                    .toLowerCase();

            const selectedStatus =
                statusFilter.value;


            let visibleTickets = 0;


            ticketRows.forEach(function (row) {

                const ticketId =
                    row.dataset.ticketId.toLowerCase();

                const subject =
                    row.dataset.subject.toLowerCase();

                const status =
                    row.dataset.status;


                // Check search input
                const matchesSearch =
                    ticketId.includes(searchText) ||
                    subject.includes(searchText);


                // Check selected status
                const matchesStatus =
                    selectedStatus === "all" ||
                    status === selectedStatus;


                // Display ticket only when both conditions match
                if (matchesSearch && matchesStatus) {

                    row.style.display = "";

                    visibleTickets++;

                } else {

                    row.style.display = "none";

                }

            });


            // Show result message
            filterResult.hidden = false;


            if (visibleTickets === 0) {

                filterResult.textContent =
                    "No matching tickets found.";

                noTicketsMessage.hidden = false;

            } else if (visibleTickets === 1) {

                filterResult.textContent =
                    "1 matching ticket found.";

                noTicketsMessage.hidden = true;

            } else {

                filterResult.textContent =
                    visibleTickets +
                    " matching tickets found.";

                noTicketsMessage.hidden = true;

            }

        }
    );


    // Clear search and show all tickets again
    clearFilters.addEventListener(
        "click",
        function () {

            ticketSearch.value = "";

            statusFilter.value = "all";


            ticketRows.forEach(function (row) {

                row.style.display = "";

            });


            filterResult.hidden = true;

            noTicketsMessage.hidden = true;

        }
    );

}


// =========================================================
// TICKET DETAIL - STATUS UPDATE
// =========================================================

const statusUpdateForm = document.getElementById("statusUpdateForm");

if (statusUpdateForm) {

    const statusSelect = document.getElementById("statusSelect");
    const ticketStatusBadge = document.getElementById("ticketStatusBadge");
    const statusFeedback = document.getElementById("statusFeedback");

    statusUpdateForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const newStatus = statusSelect.value;
        const newStatusText = statusSelect.options[statusSelect.selectedIndex].text;

        ticketStatusBadge.textContent = newStatusText;
        ticketStatusBadge.className = "status " + newStatus;

        statusFeedback.textContent = "Status updated to " + newStatusText + ".";
        statusFeedback.hidden = false;

    });

}


// =========================================================
// TICKET DETAIL - ADD COMMENT
// =========================================================

const commentForm = document.getElementById("commentForm");

if (commentForm) {

    const commentInput = document.getElementById("comment");
    const messageList = document.getElementById("messageList");

    commentForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const commentText = commentInput.value.trim();

        if (commentText === "") {
            return;
        }

        const newMessage = document.createElement("li");
        newMessage.innerHTML = "<strong>IT Support</strong> " + commentText;

        messageList.appendChild(newMessage);

        commentInput.value = "";

    });

}


// =========================================================
// HELP CENTER - EXPAND/COLLAPSE TROUBLESHOOTING STEPS
// =========================================================

const faqHeadings = document.querySelectorAll(".faq-section h3");

if (faqHeadings.length > 0) {

    faqHeadings.forEach(function (heading) {

        heading.classList.add("faq-toggle");

        const stepsList = heading.nextElementSibling;

        stepsList.hidden = true;

        heading.addEventListener("click", function () {

            stepsList.hidden = !stepsList.hidden;

        });

    });

}

