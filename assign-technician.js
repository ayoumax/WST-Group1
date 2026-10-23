// ==========================================================================
// MotorPH IT Support - Assign Technician
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

    if (!assignmentForm || !ticketSelect || !technicianSelect) {
        return;
    }

    const submitButton =
        assignmentForm.querySelector('button[type="submit"]');

    let technicians = [];
    let ready = false;
    let submitting = false;

    function showFeedback(title, message, success = false) {
        feedbackTitle.textContent = title;
        feedbackMessage.textContent = message;
        feedback.className = success
            ? "ticket-feedback success"
            : "ticket-feedback error";
        feedback.hidden = false;
    }

    function setPlaceholder(select, message) {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = message;
        select.replaceChildren(option);
    }

    async function request(url, options = {}) {
        const response = await fetch(url, {
            cache: "no-store",
            ...options
        });

        if (response.status === 401) {
            window.location.replace("/index.html");
            throw new Error("Please log in again.");
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Request failed.");
        }

        return data;
    }

    async function loadTickets() {
        const data = await request("/tickets");

        if (!Array.isArray(data.tickets)) {
            throw new Error("Invalid ticket data received.");
        }

        setPlaceholder(ticketSelect, "Select Ticket");

        data.tickets.forEach(function (ticket) {
            const option = document.createElement("option");
            const technician =
                ticket.assignedTech ||
                ticket.technician ||
                "Unassigned";

            option.value = ticket.id;
            option.textContent =
                ticket.id + " - " + ticket.subject +
                " [" + technician + "]";

            ticketSelect.appendChild(option);
        });
    }

    async function loadTechnicians() {
        const data = await request("/technicians");

        if (!Array.isArray(data.technicians)) {
            throw new Error("Invalid technician data received.");
        }

        technicians = data.technicians;

        setPlaceholder(
            technicianSelect,
            technicians.length
                ? "Select Technician"
                : "No technician accounts available"
        );

        technicians.forEach(function (technician) {
            const option = document.createElement("option");
            option.value = technician.id;
            option.textContent = technician.name;
            technicianSelect.appendChild(option);
        });
    }

    async function initialize() {
        ticketSelect.disabled = true;
        technicianSelect.disabled = true;
        submitButton.disabled = true;

        setPlaceholder(ticketSelect, "Loading tickets...");
        setPlaceholder(technicianSelect, "Loading technicians...");

        try {
            await Promise.all([
                loadTickets(),
                loadTechnicians()
            ]);

            ready = technicians.length > 0;
            ticketSelect.disabled = false;
            technicianSelect.disabled = !ready;
            submitButton.disabled = !ready;

            if (!ready) {
                showFeedback(
                    "No Technicians Available",
                    "A technician account is needed before assigning tickets."
                );
            }
        } catch (error) {
            showFeedback("Unable to Load Assignment Form", error.message);
        }
    }

    assignmentForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        if (!ready || submitting) {
            return;
        }

        const ticketId = ticketSelect.value;
        const technician = technicians.find(
            item => item.id === technicianSelect.value
        );

        if (!ticketId || !technician) {
            showFeedback(
                "Assignment Incomplete",
                "Please select a ticket and a technician."
            );
            return;
        }

        submitting = true;
        submitButton.disabled = true;
        ticketSelect.disabled = true;
        technicianSelect.disabled = true;

        try {
            // Keep the existing backend assignment field.
            await request(
                "/tickets/" + encodeURIComponent(ticketId),
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        assignedTech: technician.name
                    })
                }
            );

            showFeedback(
                "Technician Assigned Successfully",
                ticketId + " has been assigned to " +
                    technician.name + ".",
                true
            );

            try {
                await loadTickets();
                ticketSelect.value = ticketId;
            } catch (error) {
                showFeedback(
                    "Assignment Saved",
                    "The assignment was saved, but the ticket list " +
                        "could not refresh. Reload the page.",
                    true
                );
            }
        } catch (error) {
            showFeedback("Assignment Failed", error.message);
        } finally {
            submitting = false;
            submitButton.disabled = false;
            ticketSelect.disabled = false;
            technicianSelect.disabled = false;
        }
    });

    initialize();
});