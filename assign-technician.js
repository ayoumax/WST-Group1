// ==========================================================================
// MotorPH IT Support - Assign Technician Interactivity
// ==========================================================================

document.addEventListener("DOMContentLoaded", function () {

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


    const STORAGE_KEY =
        "motorphTickets";


    // Get saved tickets from localStorage
    function getSavedTickets() {

        const savedTickets =
            localStorage.getItem(STORAGE_KEY);

        if (savedTickets === null) {
            return [];
        }

        return JSON.parse(savedTickets);

    }


    // Save updated tickets
    function saveTickets(tickets) {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(tickets)
        );

    }


    // Add locally saved tickets to dropdown
    const savedTickets =
        getSavedTickets();


    savedTickets.forEach(
        function (ticket) {

            const option =
                document.createElement("option");


            option.value =
                ticket.id;


            option.textContent =
                ticket.id +
                " - " +
                ticket.subject;


            ticketSelect.appendChild(
                option
            );

        }
    );


    // Respond when form is submitted
    assignmentForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const selectedTicket =
                ticketSelect.value;

            const selectedTechnician =
                technicianSelect.value;


            // Validation
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

                feedback.hidden =
                    false;

                return;

            }


            if (selectedTicket === "") {

                feedbackTitle.textContent =
                    "Assignment Incomplete";

                feedbackMessage.textContent =
                    "Please select a support ticket.";

                feedback.className =
                    "ticket-feedback error";

                feedback.hidden =
                    false;

                return;

            }


            if (selectedTechnician === "") {

                feedbackTitle.textContent =
                    "Assignment Incomplete";

                feedbackMessage.textContent =
                    "Please select a technician.";

                feedback.className =
                    "ticket-feedback error";

                feedback.hidden =
                    false;

                return;

            }


            const ticketText =
                ticketSelect.options[
                    ticketSelect.selectedIndex
                ].text;


            const technicianText =
                technicianSelect.options[
                    technicianSelect.selectedIndex
                ].text;


            // Check if selected ticket is from localStorage
            const tickets =
                getSavedTickets();


            const selectedSavedTicket =
                tickets.find(
                    function (ticket) {

                        return (
                            ticket.id ===
                            selectedTicket
                        );

                    }
                );


            // Save technician assignment
            if (selectedSavedTicket) {

                selectedSavedTicket.technician =
                    technicianText;


                selectedSavedTicket.status =
                    "in-progress";


                selectedSavedTicket.statusText =
                    "In Progress";


                saveTickets(
                    tickets
                );

            }


            // Show response
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


            feedback.className =
                "ticket-feedback success";

            feedback.hidden =
                false;

        }
    );

});