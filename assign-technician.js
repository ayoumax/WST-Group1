// ==========================================================================
// MotorPH IT Support - Assign Technician Interactivity (Week 4)
// ==========================================================================

document.addEventListener("DOMContentLoaded", function () {

    // Locate webpage elements
    const assignmentForm =
        document.getElementById("assignTechnicianForm");

    const ticketSelect =
        document.getElementById("admin-ticket");

    const technicianSelect =
        document.getElementById("technician");

    const feedback =
        document.getElementById("assignmentFeedback");

    const feedbackTitle =
        document.getElementById("assignmentFeedbackTitle");

    const feedbackMessage =
        document.getElementById("assignmentFeedbackMessage");


    // Respond when the form is submitted
    assignmentForm.addEventListener("submit", function (event) {

        event.preventDefault();


        // Read user selections
        const selectedTicket =
            ticketSelect.value;

        const selectedTechnician =
            technicianSelect.value;


        // Validate user input
        if (
            selectedTicket === "" &&
            selectedTechnician === ""
        ) {

            feedbackTitle.textContent =
                "Assignment Incomplete";

            feedbackMessage.textContent =
                "Please select a ticket and a technician.";

            feedback.className =
                "ticket-feedback error";

            feedback.hidden = false;

            return;

        }


        if (selectedTicket === "") {

            feedbackTitle.textContent =
                "Assignment Incomplete";

            feedbackMessage.textContent =
                "Please select a support ticket.";

            feedback.className =
                "ticket-feedback error";

            feedback.hidden = false;

            return;

        }


        if (selectedTechnician === "") {

            feedbackTitle.textContent =
                "Assignment Incomplete";

            feedbackMessage.textContent =
                "Please select a technician.";

            feedback.className =
                "ticket-feedback error";

            feedback.hidden = false;

            return;

        }


        // Get visible option text
        const ticketText =
            ticketSelect.options[
                ticketSelect.selectedIndex
            ].text;

        const technicianText =
            technicianSelect.options[
                technicianSelect.selectedIndex
            ].text;


        // Conditional response
        if (selectedTechnician === "team") {

            feedbackTitle.textContent =
                "Ticket Assigned to Support Team";

            feedbackMessage.textContent =
                ticketText +
                " has been assigned to the IT Support Team.";

        } else {

            feedbackTitle.textContent =
                "Technician Assigned Successfully";

            feedbackMessage.textContent =
                ticketText +
                " has been assigned to " +
                technicianText +
                ".";

        }


        // Display result dynamically
        feedback.className =
            "ticket-feedback success";

        feedback.hidden = false;

    });

});