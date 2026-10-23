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


    // ======================================================================
    // LOAD TICKETS FROM SERVER
    // ======================================================================

    async function loadTickets() {

        try {

            const response =
                await fetch("/tickets");


            if (!response.ok) {

                throw new Error(
                    "Unable to load tickets from server."
                );

            }


            const data =
                await response.json();

            const tickets =
                data.tickets || [];


            // Keep only the default placeholder option
            ticketSelect.innerHTML =
                '<option value="">Select Ticket</option>';


            // Populate dropdown with tickets from backend
            tickets.forEach(
                function (ticket) {

                    const option =
                        document.createElement("option");

                    option.value =
                        ticket.id;


                    const techName =
                        ticket.assignedTech ||
                        ticket.technician ||
                        "Unassigned";


                    option.textContent =
                        ticket.id +
                        " - " +
                        ticket.subject +
                        " [" +
                        techName +
                        "]";


                    ticketSelect.appendChild(
                        option
                    );

                }
            );

        } catch (error) {

            console.error(
                "Error loading tickets:",
                error
            );

            feedbackTitle.textContent =
                "Error Loading Tickets";

            feedbackMessage.textContent =
                "Could not load tickets from server. Please refresh the page.";

            feedback.className =
                "ticket-feedback error";

            feedback.hidden =
                false;

        }

    }


    // Initial fetch of tickets
    loadTickets();


    // ======================================================================
    // HANDLE ASSIGNMENT FORM SUBMISSION
    // ======================================================================

    assignmentForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const selectedTicket =
                ticketSelect.value;

            const selectedTechnician =
                technicianSelect.value;


            // Form validation
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


            const technicianText =
                technicianSelect.options[
                    technicianSelect.selectedIndex
                ].text.trim();


            // Send PATCH request to backend
            try {

                const response =
                    await fetch(
                        "/tickets/" +
                            encodeURIComponent(selectedTicket),
                        {
                            method:
                                "PATCH",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    assignedTech:
                                        technicianText
                                })
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    feedbackTitle.textContent =
                        "Assignment Failed";

                    feedbackMessage.textContent =
                        result.message ||
                        "Failed to assign technician.";

                    feedback.className =
                        "ticket-feedback error";

                    feedback.hidden =
                        false;

                    return;

                }


                // Show success feedback
                if (selectedTechnician === "team") {

                    feedbackTitle.textContent =
                        "Ticket Assigned to Support Team";

                    feedbackMessage.textContent =
                        selectedTicket +
                        " has been assigned to the IT Support Team.";

                } else {

                    feedbackTitle.textContent =
                        "Technician Assigned Successfully";

                    feedbackMessage.textContent =
                        selectedTicket +
                        " has been assigned to " +
                        technicianText +
                        ".";

                }


                feedback.className =
                    "ticket-feedback success";

                feedback.hidden =
                    false;


                // Reload dropdown so the updated assignment shows immediately
                await loadTickets();

                // Keep the assigned ticket selected in the dropdown
                ticketSelect.value =
                    selectedTicket;

            } catch (error) {

                console.error(
                    "Network error during assignment:",
                    error
                );

                feedbackTitle.textContent =
                    "Network Error";

                feedbackMessage.textContent =
                    "Unable to connect to the server. Please try again.";

                feedback.className =
                    "ticket-feedback error";

                feedback.hidden =
                    false;

            }

        }
    );

});
