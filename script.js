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
        if (subject === "" || category === "" || description === "") {

            feedbackTitle.textContent = "Please Complete the Form";

            feedbackMessage.textContent =
                "Subject, Category, and Problem Description are required.";

            ticketFeedback.className = "ticket-feedback error";
            ticketFeedback.hidden = false;

            window.showToast("Please complete the required fields.", "error");

            if (subject === "") {
                subjectInput.focus();
            } else if (category === "") {
                categoryInput.focus();
            } else {
                descriptionInput.focus();
            }

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
        feedbackTitle.textContent = "Ticket Details Preview";

        if (priority === "urgent") {
            feedbackMessage.textContent =
                "Review your urgent ticket details below.";
        } else if (priority === "high") {
            feedbackMessage.textContent =
                "Review your high-priority ticket details below.";
        } else {
            feedbackMessage.textContent =
                "Review your ticket details below.";
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

        ticketForm.addEventListener("reset", function () {

            ticketFeedback.hidden = true;
            window.showToast("Form cleared.");
        });

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